import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useParams, useNavigate } from 'react-router-dom';
import './Homepage.css';
import './Content.css'
import { post } from '../../types/Post';

const Content = () => {

    const {id} = useParams();
    const [content, setContent] = useState<post>();
    const [updatedLike, setUpdatedLike] = useState<post>();
    const [likeStatus, setLikeStatus] = useState();

    const username = localStorage.getItem('userid');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    // Like function: send the userid to backend, for update numOfLike and likedList
    const clickedLike = async () => {
        try {
            console.log(id);
            const response = await fetch (`http://localhost:3000/api/addNumOfLike/${id}`, {
                method: 'post',
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

    // get request to load the element of clicked post
    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/displayContent/${id}?username=${username}`, {
                    method: 'get'
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setContent(data.accordingContent);
                    setLikeStatus(data.likeStatus);
                }
            } catch (errorMsg) {
                console.error('內容請求錯誤:', errorMsg);
            }
        }
        fetchContent();
    }, [updatedLike]);

    return (
        <>
            <Header />
            <div className='homepage-container'>
                <div className='contentPage-container'>
                        {content ? (
                            <>
                                <div className='contentPage-topic'>{content.topicName}</div>
                                <div className='contentPage-text'>{content.content}</div>
                                <div className='contentPage-starAndComment-container'>
                                    <img className='contentPage-starAndComment-like' onClick={clickedLike} src={likeStatus === true ? '/thumbs-up.png' : '/thumbs-up-grey.png'}></img>
                                    {updatedLike ? (
                                        <div>{updatedLike.numOfLike}</div> ) : (
                                            <div>{content.numOfLike}</div>
                                        )
                                    }
                                </div>   
                            </>           
                        ) : (
                            <div>沒有內容</div>
                        )}
                </div>
            </div>
        </>    
    )
}

export default Content;