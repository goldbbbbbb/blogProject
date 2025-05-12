import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import './Homepage.css';
import './Content.css'
import { post } from '../../types/Post';
import { user } from '../../types/User';
import UserInfoRequest from '../../components/UserInfoRequest';
import PostContentSession from '../../components/contentPage/postContentSession';
import PostCommentSession from '../../components/contentPage/postCommentSession';

const Content = () => {

    const {id} = useParams();
    const [content, setContent] = useState<post>();
    const [likeStatus, setLikeStatus] = useState<boolean>(false);
    const [bookmarkStatus, setBookmarkStatus] = useState<boolean>(false);
    const [userData, setUserData] = useState<user | null>(null);
    const username = localStorage.getItem('userid');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    // get request to load the element of clicked post
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/displayContent/${id}?username=${username}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setContent(data.accordingContent);
                    setLikeStatus(data.likeStatus);
                    setBookmarkStatus(data.bookmarkStatus);
                } else if (data.invalidToken) {
                    alert(data.message);
                    localStorage.clear();
                    navigate('/');
                } else {
                    alert(data.message);
                }
            } catch (errorMsg) {
                console.error('內容請求錯誤:', errorMsg);
                alert('伺服器發生錯誤，請稍後再試');
            }
        }
        fetchContent();
    }, [likeStatus, bookmarkStatus]);

    return (
        <>
            <Header />
            <UserInfoRequest url="http://localhost:3000/api/getUserInfo" setUserData={setUserData} />
            {content?
                    <div className='homepage-container'>
                        <div className='contentPage-container'>
                            <PostContentSession id={id!} content={content} likeStatus={likeStatus} setLikeStatus={setLikeStatus} bookmarkStatus={bookmarkStatus} setBookmarkStatus={setBookmarkStatus}/>
                            <PostCommentSession id={id!} userData={userData}/> 
                        </div>
                    </div>
                :
                <div>沒有內容</div>
            }
        </>    
    )
}

export default Content;