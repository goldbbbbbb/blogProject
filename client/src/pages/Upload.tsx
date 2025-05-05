import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Upload.css';
import { useParams, useNavigate } from 'react-router-dom';

const Uploadpage = () => {

    const [topic, setTopic] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [numOfLike, setNumOfLike] = useState<number>(0);
    const [action, setAction] = useState<string>('');

    const author = localStorage.getItem('userid');
    const token = localStorage.getItem('token');
    const {id} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAccordingPost = async () => {
            if (id) {
                try {
                    const response = await fetch (`http://localhost:3000/api/displayContent/${id}`, {
                        method: 'get',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (data.success) {
                        setTopic(data.accordingContent.topicName);
                        setContent(data.accordingContent.content);
                        setCategory(data.accordingContent.category);
                        setNumOfLike(data.accordingContent.numOfLike);
                    } else if (data.invalidToken) {
                        alert(data.message);
                        localStorage.clear();
                        navigate('/');
                    } else {
                        alert(data.message);
                    }
                } catch (errorMsg) {
                    console.error('內容請求錯誤:', errorMsg);
                }
            } else {
                // reset input
                setTopic('');
                setContent('');
                setCategory('');
                setNumOfLike(0);
            }
        }
        fetchAccordingPost();
    }, [id])

    const onTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopic(event.target.value);
    }
    const onContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(event.target.value);
    }
    const onCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategory(event.target.value);
    }
    const onNumOfLikeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNumOfLike(Number(event.target.value));
    } 

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/api/upload/${id}`, {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({topic, author, content, category, numOfLike, action})
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert(`${data.action}成功！`);
            } else if (data.invalidToken) {
                alert(data.message);
                localStorage.clear();
                navigate('/');
            } else {
                alert(data.message);
            }           
        } catch (errorMsg) {
          console.error('登入請求錯誤:', errorMsg);             
        }
    }
    return (
        <>
            <Header />
            <div className='upload-session-container'>
                <div className='upload-sessionCard-container'>
                        <form className='upload-sessionContent-container' onSubmit={handleSubmit}>
                            <div className='upload-sessionContent-topicAndSelectItems-container'>
                                <div className='upload-sessionContent-items-topic'>
                                    <input
                                        type='text'
                                        id='topic'
                                        className='upload-sessionContent-items-topicbar'
                                        value={topic}
                                        placeholder='輸入標題'
                                        onChange={onTopicChange}
                                        required
                                    />
                                </div>
                                <div className='upload-sessionContent-items-select'>
                                    <select
                                        id='category'
                                        value={category}
                                        onChange={onCategoryChange}
                                        required
                                    >
                                        <option value=''>選擇分類</option>
                                        <option value='leetcode'>Leetcode題解</option>
                                        <option value='newtech'>最新科技</option>
                                    </select>
                                </div>
                            </div>
                            <div className='upload-sessionContent-items-content'>
                                <textarea
                                    id='content'
                                    className={content ? 'upload-sessionContent-items-contentarea': 'upload-sessionContent-items-contentarea-notext'}
                                    placeholder='輸入內容'
                                    value={content}
                                    onChange={onContentChange}
                                    required
                                />
                            </div>
                            <div className='upload-sessionContent-items-content'> 
                                <div>預設點讚數(僅供測試!)</div>
                                    <input
                                        type='number'
                                        id='numoflike'
                                        className='upload-sessionContent-items-likebar'
                                        value={numOfLike}
                                        onChange={onNumOfLikeChange}
                                    />
                            </div>
                            <div className='upload-submit'>
                                {id ?
                                    <>
                                        <button onClick={() => setAction('edit')} className='upload-sessionContent-items-submitButton'>編輯</button>
                                        <button onClick={() => setAction('delete')} className='upload-sessionContent-items-submitButton'>刪除</button>
                                    </>
                                    :
                                        <button className='upload-sessionContent-items-submitButton'>上傳</button>
                                }
                            </div>
                        </form>
                </div>
            </div>
        </>
    )
}

export default Uploadpage;

