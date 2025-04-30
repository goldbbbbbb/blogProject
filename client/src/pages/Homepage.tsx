import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Homepage.css'
import { useNavigate } from 'react-router-dom';
import PostList from '../../components/Postlist';
import { post } from '../../types/Post';

const Homepage = () => {
    const [allPosts, setAllPosts] = useState<post[]>([]);
    const [currCategory, setCurrCategory] = useState<string>('popular'); 
    const navigate = useNavigate();

    const changeCategory = (category: string) => {
        setCurrCategory(category);
    }

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/displayTopic?category=${currCategory}`, {
                    method: 'GET',
                });
                const data = await response.json();
                if (data.success) {
                    setAllPosts(data.postlist);
                }
            } catch (errorMsg) {
                console.error('標題請求錯誤:', errorMsg);        
            }            
        }
        fetchAllPosts();
    }, [currCategory]);

    const moveToContent = (id: string) => {
        navigate(`/content/${id}`);
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
                    <div className="homepage-content-topic-container">
                        <PostList posts={allPosts} moveToContent={moveToContent} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Homepage;