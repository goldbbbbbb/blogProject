import '../styles/Authentication.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Signin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userid') !== null) {
      navigate('/homepage')
    }
  }, [navigate]); 

  const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  } 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 防止表單的預設提交行為 (重新載入頁面)    

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });
      const data = await response.json();
      if (data.success) {
        localStorage.setItem('userid', `${data.userId}`);
        navigate('/homepage');
      } else {
        console.error('登入失敗:', data);
      }
    } catch (error) {
          console.error('登入請求錯誤:', error);
    }
  }

    return (
      <div className = 'auth-container'>
        <div className = 'auth-card-container'>
          <div className = 'auth-card'>
            <div className = 'auth-cardform'>
              <form onSubmit={handleSubmit} className = 'auth-cardform'>
                <img alt='gdblandlogo' className='auth-cardform-logo' src='./logo.png'></img>
                <input 
                  type='text' 
                  id='username' 
                  value={username}
                  onChange={onUsernameChange}
                  className='auth-cardform-input' 
                  placeholder='用戶名'>
                </input>
                <input 
                  type='password' 
                  id='password' 
                  value={password}
                  onChange={onPasswordChange}
                  className='auth-cardform-input'
                  placeholder='密碼'>
                </input>
                <button type='submit' className = 'auth-cardform-button'>登錄</button>     
              </form>
              <div className = 'auth-text'><Link to ='/register'>沒有帳號？立即注冊</Link></div>              
            </div>         
          </div>
        </div>
      </div>
    );
}
  
  export default Signin;