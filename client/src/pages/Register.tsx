import '../../styles/Authentication.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import ManageFormData from '../../components/ManageFormData'

const Registerpage = () => {
    // import those two functions to use
    const {formData, OnInputChange} = ManageFormData();

    const navigate = useNavigate();

    // post request to check the AC/Email/PW used for register is valid or not
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username: formData.username, email: formData.email, password: formData.password}),
        });
        const data = await response.json();
        if (response.ok && data.success) {
          navigate('/success');
        } else {
          alert(data.message);
        }
      } catch (errorMsg) {
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
                    name='username'
                    value={formData.username || ''}
                    onChange={OnInputChange}
                    className='auth-cardform-input' 
                    placeholder='用戶名'
                    required>
                  </input>
                  <input 
                    type='email'
                    name='email'
                    value={formData.email || ''}
                    onChange={OnInputChange}
                    className='auth-cardform-input'
                    placeholder='電郵'
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
                  <button type='submit' className ='auth-cardform-button'>注冊</button>     
                </form>
                <div className = 'auth-text'><Link to ='/'>已有帳號？立即登入</Link></div>              
              </div>         
            </div>
          </div>
        </div>
      );
}

export default Registerpage;