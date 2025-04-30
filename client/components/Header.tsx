import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();

    const route = (inputPage: string) => {
        navigate(`/${inputPage}`);
    }

    return (
        <div className='header-container'>
            <div className='header-left-container'>
                <img onClick={() => route('homepage')} alt='gdblandlogo' src='/logo.png'></img>
            </div>
            <div className='header-right-container'>
                <button onClick={() => route('upload')} className='header-right-button'>上傳</button>
                <button onClick={() => route('setting')} className='header-right-button'>用戶設定</button>
                <button onClick={() => route('')} className='header-right-button'>登出</button>
            </div>
        </div>
    )
}

export default Header;