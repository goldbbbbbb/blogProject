import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Homepage.css'
import { useNavigate } from 'react-router-dom';
import ContentList from '../../components/HomePageContent';

const Homepage = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [currCategory, setCurrCategory] = useState<string>('popular'); 
    const navigate = useNavigate();

    const changeCategory = (category: string) => {
        setCurrCategory(category);
    }

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/displayTopic?category=${currCategory}`, {
                    method: 'GET',
                });
                const data = await response.json();
                if (data.success) {
                    setUsers(data.postlist);
                }
            } catch (errorMsg) {
                console.error('標題請求錯誤:', errorMsg);        
            }            
        }
        fetchUsername();
    }, [currCategory]);

    const moveToContent = (topic: string) => {
        navigate(`/content/${topic}`);
    }

    return (
        <>
            <Header />
            <div className='homepage-container'>
                <div className='homepage-content-container'>
                    <div className='homepage-content-navigationbar-container'>
                        <button onClick={() => changeCategory('popular')} className='homepage-content-navigationbar-item'>熱門話題</button>
                        <button onClick={() => changeCategory('leetcode')} className='homepage-content-navigationbar-item'>Leetcode題解</button>
                        <button onClick={() => changeCategory('newtech')} className='homepage-content-navigationbar-item'>最新AI科技</button>
                    </div>
                        <ContentList users={users} moveToContent={moveToContent} />
                </div>
            </div>
        </>
    )
}

export default Homepage;