import React, { useState } from 'react';
import { post } from '../../types/Post';
import { useNavigate } from 'react-router-dom';

interface PostContentSessionProps {
    id: string
    content: post,
    likeStatus: boolean,
    setLikeStatus: React.Dispatch<React.SetStateAction<boolean>>
    bookmarkStatus: boolean,
    setBookmarkStatus: React.Dispatch<React.SetStateAction<boolean>>    
}


const PostContentSession = (({id, content, likeStatus, setLikeStatus, bookmarkStatus, setBookmarkStatus}: PostContentSessionProps) => {
    // when user clicked like/bookmark, update the num of like/bookmark on real time
    const [updatedLike, setUpdatedLike] = useState<number>();
    const [updatedBookmark, setUpdatedBookmark] = useState<number>();
    
    const username = localStorage.getItem('userid');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const clickedLike = async () => {
        try {
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
                setLikeStatus(!likeStatus);
                setUpdatedLike(data.numOfLike);
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

    const clickedBookmark = async () => {
        try {
            const response = await fetch (`http://localhost:3000/api/addNumOfBookmark/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({username}),
            });
            const data = await response.json();
            if (response.ok && data.success) {
                setBookmarkStatus(!bookmarkStatus);
                setUpdatedBookmark(data.numOfBookmark);
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
            <div className='contentPage-topic'>{content.topicName}</div>
            <div className='contentPage-text' dangerouslySetInnerHTML={{ __html: content.content }}/>
            <div className='contentPage-clicklike-container'>
                <img className='contentPage-clicklike-icon' onClick={clickedLike} src={likeStatus === true ? '/thumbs-up.png' : '/thumbs-up-grey.png'}></img>
                {updatedLike ? (
                    <div>{updatedLike}</div> ) : (
                        <div>{content.numOfLike}</div>
                    )
                }
                <img className='contentPage-clicklike-icon' onClick={clickedBookmark} src={bookmarkStatus === true ? '/star.png' : '/star-grey.png'}></img>
                {updatedBookmark ? (
                    <div>{updatedBookmark}</div> ) : (
                        <div>{content.numOfBookmark}</div>
                    )
                }
            </div>     
        </>     
    )
})

export default PostContentSession;