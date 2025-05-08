import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { user } from '../types/User';

interface UserInfoRequestProps {
    url: string; // 明確指定 url 的類型
    setUserData: (data: user | null) => void;
  }

const UserInfoRequest = ({ url, setUserData }: UserInfoRequestProps) => {
  const userid = localStorage.getItem('userid');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await fetch(`${url}?userid=${userid}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok && data.success) {
          setUserData(data.userData);
        } else if (data.invalidToken) {
          alert(data.message);
          localStorage.clear();
          navigate('/');
        } else {
          alert(data.message);
        }
      } catch (errorMsg) {
        console.error(errorMsg);
        alert('伺服器發生錯誤，請稍後再試');
      }
    };
    getUserInfo();
  }, [url, setUserData]);

  return null; // 不需要返回 UI
};

export default UserInfoRequest;