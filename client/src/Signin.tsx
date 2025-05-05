import '../styles/Authentication.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ManageFormData from '../components/ManageFormData'

const Signin = () => {
  // import those two functions to use
  const {formData, OnInputChange} = ManageFormData();
  const navigate = useNavigate();

  // Auto-login if user logined before
  useEffect(() => {
    if (localStorage.getItem('userid') !== null) {
      navigate('/homepage')
    }
  }, [navigate]); 

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // prevent reflash on the form before receive result of post request
    event.preventDefault();    

    // post request to check the AC/PW valid or not
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username: formData.username, password: formData.password}),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        alert(data.message);
        localStorage.setItem('userid', `${data.userId}`);
        localStorage.setItem('token', `${data.token}`);
        navigate('/homepage');
      } else {
        alert(data.message);
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
                  name='username' 
                  value={formData.username || ''}
                  onChange={OnInputChange}
                  className='auth-cardform-input' 
                  placeholder='用戶名'
                  required>
                </input>
                <input 
                  type='password' 
                  name='password'
                  value={formData.password || ''}
                  onChange={OnInputChange}
                  className='auth-cardform-input'
                  placeholder='密碼'
                  required>
                </input>
                <button type='submit' className='auth-cardform-button'>登錄</button>     
              </form>
              <div className='auth-text'><Link to ='/register'>沒有帳號？立即注冊</Link></div>              
            </div>         
          </div>
        </div>
      </div>
    );
}
  
  export default Signin;