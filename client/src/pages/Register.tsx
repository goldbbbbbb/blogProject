import '../../styles/Authentication.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const Registerpage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const onUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setUsername(event.target.value);
    }
    const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEmail(event.target.value);
    } 
    const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setPassword(event.target.value);
    } 
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        console.log('準備發送的數據:', { username, email, password });
        console.log('username 的類型:', typeof username);
        console.log('email 的類型:', typeof email);
        console.log('password 的類型:', typeof password);
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, email, password}),
        });
        const data = await response.json();
        if (data.success) {
          navigate('/success');
        } else {
          alert('注冊失敗');
        }
      } catch (errorMsg) {
          // 處理網路錯誤或其他 fetch 過程中發生的錯誤
          console.error('登入請求錯誤:', errorMsg);        
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
                    type='email'
                    id='email'
                    value={email}
                    onChange={onEmailChange}
                    className='auth-cardform-input'
                    placeholder='電郵'>
                  </input>
                  <input
                    type='password' 
                    id='password'
                    value={password}
                    onChange={onPasswordChange}
                    className='auth-cardform-input'
                    placeholder='密碼'>
                  </input>
                  <button type='submit' className = 'auth-cardform-button'>注冊</button>     
                </form>
                <div className = 'auth-text'><Link to ='/'>已有帳號？立即登入</Link></div>              
              </div>         
            </div>
          </div>
        </div>
      );
}

export default Registerpage;