import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditIcon.css';

interface UserProfileProps {
  updateSection: (section: string) => void;
}

const Testpage = ({updateSection} : UserProfileProps) => {
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [currIcon, setCurrIcon] = useState<string>('');
    const userid = localStorage.getItem('userid');
    const token = localStorage.getItem('token');
    let avatarKey: string;

    // get request to get the icon of user
    useEffect(() => {
      const getCurrIcon = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/getUserInfo?userid=${userid}`, {
            method: 'get',
            headers: {
              'Authorization': `Bearer ${token}`
            } 
          });
          const data = await response.json();
          if (response.ok && data.success) {
            setCurrIcon(`https://blogdb-avatar.s3.ap-southeast-1.amazonaws.com/${data.userData.iconURL}`)
          } else if (data.invalidToken) {
            alert(data.message);
            localStorage.clear();
            navigate('/');
          } else {
            alert(data.message);
          }
        } catch (errorMsg) {
          console.error(errorMsg);
        }
      }
      getCurrIcon();
    }, []);

    // keep the input state of user
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };
  
    const handleUpload = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!file) return alert('請選擇圖片');
      
      // 1. 取得預簽名 URL 跟 用於儲存到DB的Key
      try {
        const response = await axios.post('http://localhost:3000/api/get-presigned-url', 
          { userid, filename: file.name, filetype: file.type },
          { headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        if (response.data.success) {
          const url = response.data.url;
          avatarKey = response.data.uniqueKey;

          // 2. 用預簽名 URL 上傳圖片到 AWS S3
          await axios.put(url, 
            file, 
            { headers: {
                'Content-Type': file.type,
              },
            }
          );
          
          // 3. 把 avatarUrl 存到用戶資料庫
          try {
            const response = await fetch('http://localhost:3000/api/storeUrl', {
              method: 'patch',
              headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({userid, avatarKey})
            })
            const data = await response.json();
            if (response.ok && data.success) {
              alert('成功上傳頭像');
              setCurrIcon(`https://blogdb-avatar.s3.ap-southeast-1.amazonaws.com/${avatarKey}`);
            } else if (data.invalidToken) {
              alert(data.message);
              localStorage.clear();
              navigate('/');
            } else {
              alert(data.message);
            }
          } catch (errorMsg) {
            console.error ('上傳URL到DB時發生錯誤', errorMsg);
          }

        }        
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.data.invalidToken) {
            alert(error.response.data.message);
            localStorage.clear();
            navigate('/');
          }
        } else {
          alert('發生網路錯誤');
          console.error(error);
        }
      }
    };

    return (
        <div>
            <button onClick={() => updateSection('profile')}>回到用戶設定</button>
            <form onSubmit={handleUpload}>
              <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileChange}
              >
              </input>
              <img className='icon' src={currIcon === '' ? '/defaultIcon.png' : currIcon}></img>
              <div></div>
              <button type='submit'>上傳頭像</button>
            </form>
        </div>
    )
}

export default Testpage;