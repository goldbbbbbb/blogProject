import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { useParams } from 'react-router-dom';
import './Homepage.css';
import './Content.css'

const Content = () => {

    type post = {
        _id: string;
        topicName: string;
        content: string;
        numOfLike: number;
        LikedBy: string[];
    }

    const {topic} = useParams();
    const [content, setContent] = useState<post>();
    const [updatedLike, setUpdatedLike] = useState<post>();
    const [likeStatus, setLikeStatus] = useState();

    const username = localStorage.getItem('userid');

    const clickedLike = async () => {
        try {
            const response = await fetch (`http://localhost:3000/api/addNumOfLike/${topic}`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username}),
            });
            const data = await response.json();
            if (data.success) {
                setUpdatedLike(data.updatedNumOfLike);
            } 
        } catch (errorMsg) {
            console.error('點讚功能發生錯誤:', errorMsg);
        }
    }

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/displayContent/${topic}?username=${username}`, {
                    method: 'get'
                });
                const data = await response.json();
                if (data.success) {
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