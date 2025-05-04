import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import './EditIcon.css';

interface UserProfileProps {
  updateSection: (section: string) => void;
}

const Testpage = ({updateSection} : UserProfileProps) => {

    const [file, setFile] = useState<File | null>(null);
    const [currIcon, setCurrIcon] = useState<string>('');
    const userid = localStorage.getItem('userid');

    useEffect(() => {
      const getCurrIcon = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/getKeyOfIcon?userid=${userid}`, {
            method: 'get' 
          });
          const data = await response.json();
          if (response.ok && data.success) {
            setCurrIcon(`https://blogdb-avatar.s3.ap-southeast-1.amazonaws.com/${data.key}`)
          }
        } catch (errorMsg) {
          console.error(errorMsg);
        }
      }
      getCurrIcon();
    }, []);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };
  
    const handleUpload = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!file) return alert('請選擇圖片');
      
      // 1. 取得預簽名 URL 跟 用於儲存到DB的Key
      const { data } = await axios.post('http://localhost:3000/api/get-presigned-url', {
        userid,
        filename: file.name,
        filetype: file.type,
      });
      const url = data.url;
      const avatarKey = data.uniqueKey;
  
      // 2. 用預簽名 URL 上傳圖片到 AWS S3
      await axios.put(url, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
  
      // 4. 你可以把 avatarUrl 存到用戶資料庫，或顯示在頁面上
      try {
        const response = await fetch('http://localhost:3000/api/editAndStore-url', {
          method: 'post',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({userid, avatarKey})
        })
        const data = await response.json();
        if (response.ok && data.success) {
          alert('成功上傳頭像');
          setCurrIcon(`https://blogdb-avatar.s3.ap-southeast-1.amazonaws.com/${avatarKey}`);
        } else {
          alert(data.message);
        }
      } catch (errorMsg) {
        console.error ('上傳URL到DB時發生錯誤', errorMsg);
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