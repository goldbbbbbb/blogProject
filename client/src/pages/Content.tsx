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
    const [updatedLike, setUpdatedLike] = useState<post>();
    const [likeStatus, setLikeStatus] = useState<boolean>(false);
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
    }, [updatedLike]);

    const clickedLike = async () => {
        try {
            console.log(id);
            const response = await fetch (`http://localhost:3000/api/addNumOfLike/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({username}),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setUpdatedLike(data.updatedNumOfLike);
            } else if (data.invalidToken) {
                alert(data.message);
                localStorage.clear();
                navigate('/');
            } else {
                alert(data.message);
            }
        } catch (errorMsg) {
            console.error('點讚功能發生錯誤:', errorMsg);
        }
    }

    return (
        <>
            <Header />
            <UserInfoRequest url="http://localhost:3000/api/getUserInfo" setUserData={setUserData} />
            {content?
                    <div className='homepage-container'>
                        <div className='contentPage-container'>
                            <PostContentSession content={content} likeStatus={likeStatus} updatedLike={updatedLike} onLike={clickedLike}/>
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