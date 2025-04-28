import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const routeToHomepage = () => {
        navigate('/homepage');
    }

    const uploadClick = () => {
        navigate('/upload');
    };

    const logOut = () => {
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className='header-container'>
            <div className='header-left-container'>
                <img onClick={routeToHomepage} alt='gdblandlogo' src='/logo.png'></img>
            </div>
            <div className='header-right-container'>
                <button onClick={uploadClick}className='header-right-button'>上傳</button>
                <button className='header-right-button'>通知</button>
                <button className='header-right-button'>設定</button>
                <button onClick={logOut} className='header-right-button'>登出</button>
            </div>
        </div>
    )
}

export default Header;