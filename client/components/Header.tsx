import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();
    
    const route = (inputPage: string) => {
        navigate(`/${inputPage}`);
    }

    const searchRoute = () => {
        if (searchKeyword.trim() === '') {
            alert('搜尋欄需有關鍵詞');
        } else {
            navigate(`/search/${searchKeyword}`)
        }
    }

    const logoutRoute = () => {
        localStorage.clear();
        navigate('/');
    }

    const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchKeyword(event.target.value);
    }

    return (
        <div className='header-container'>
            <div className='header-left-container'>
                <img className='header-left-item' onClick={() => route('homepage')} alt='gdblandlogo' src='/logo.png'></img>
                <div className='header-left-searchbar-container'>
                    <input onChange={onSearchChange} className='header-left-searchbar-textbox' placeholder='search'></input>
                    <img onClick={searchRoute} className='header-left-searchbar-photo' src='/search.png'></img>
                </div>
            </div>
            <div className='header-right-container'>
                <button onClick={() => route('test')}>測試頁面</button>
                <button onClick={() => route('upload')} className='header-right-button'>上傳</button>
                <button onClick={() => route('setting')} className='header-right-button'>用戶設定</button>
                <button onClick={logoutRoute} className='header-right-button'>登出</button>
            </div>
        </div>
    )
}

export default Header;