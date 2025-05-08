import React, { useState, useEffect } from 'react';
import { comment } from '../../types/Comment';
import { useNavigate } from 'react-router-dom';
import { user } from '../../types/User';

const PostCommentSession = ({id, userData}: {id: string, userData: user | null}) => {

    const [comment, setComment] = useState('');
    const [commentList, setCommentList] = useState<comment[]>([]);
    const [updateComment, setUpdateComment] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // get request to load the comment session
    useEffect(() => {
        const fetchCommentSession = async () => {
            try {
                const response = await fetch (`http://localhost:3000/api/displayCommentSession?postId=${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setCommentList(data.commentList);
                    setUpdateComment(data.time); 
                } else if (data.invalidToken) {
                    alert(data.message);
                    localStorage.clear();
                    navigate('/');
                } else {
                    alert(data.message);
                }
            } catch (errorMsg) {
                console.error('留言請求錯誤:', errorMsg);
                alert('伺服器發生錯誤，請稍後再試');
            }
        }
        fetchCommentSession();
    }, []);

    // keep the content of ccomment before submit
    const OnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    }

    // submit comment
    const handleSubmit = async () => {
        console.log(userData, comment, id);
        if (!userData || comment === '' || !id) {
            alert('缺少必要欄位');
            return;
        }
        try {
            const response = await fetch('http://localhost:3000/api/submitComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({id, username: userData.username, userIcon: userData.iconURL, comment: comment})
            })
            const data = await response.json();
            if (response.ok && data.success) {
                alert('上傳留言成功');
            } else if (data.invalidToken) {
                alert(data.message);
                localStorage.clear();
                navigate('/');
            } else {
                alert(data.message);
            }
        } catch (errorMsg) {
            console.error('發送留言失敗', errorMsg);
            alert('伺服器發生錯誤，請稍後再試');
        }
    }    

    return (
        <>
            <div className='contentPage-commentSession-container'>
                <input type='text' name='comment' onChange={OnInputChange} value={comment} className='contentPage-commentSession-input' placeholder='輸入留言...'></input>
                <button onClick={handleSubmit} className='contentPage-commentSession-button'>提交</button>
            </div>
            {commentList.length > 0 ? (
                commentList.map(item => (
                    <div className='contentPage-commentList-container' key={item._id}>
                        <div className='contentPage-commentList-userinfo-container'>
                            <div className='contentPage-commentList-userinfo-icon'>
                                <img className='contentPage-commentList-userinfo-iconimage'src={`https://blogdb-avatar.s3.ap-southeast-1.amazonaws.com/${item.userIconUrl}`}></img>
                            </div>
                            <div className='contentPage-commentList-userinfo-username'>{item.username}</div>
                        </div>
                        <div className='contentPage-commentList-commentinfo-container'>
                            <div className='contentPage-commentList-commentinfo-time'>{item.date}</div>
                            <div className='contentPage-commentList-commentinfo-comment'>{item.content}</div>
                        </div>
                    </div>
                ))
            ) : (
                    <div>沒有留言</div>
            )}
        </>          
    )
}

export default PostCommentSession;