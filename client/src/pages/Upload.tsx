import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import './Upload.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { post } from '../../types/Post';

const Uploadpage = () => {
    const defaultPost: post = {
        _id: '',
        topicName: '',
        content: '',
        category: '',
        numOfLike: 0,
        numOfBookmark: 0,
        likedBy: [],
        author: ''        
    }
    const [postData, setPostData] = useState<post>(defaultPost);
    const [action, setAction] = useState<string>('');

    const author = localStorage.getItem('userid');
    const token = localStorage.getItem('token');
    const {id} = useParams();
    const navigate = useNavigate();

    // when the URL contains id => user want to edit or delete post
    // use get request to get the data of post
    // else set the state of post in default
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
                        setPostData(data.accordingContent);
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
                setPostData(defaultPost);
            }
        }
        fetchAccordingPost();
    }, [id])

    // keep the input of user during upload/edit in <input>
    const OnInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setPostData(prev => ({
            // ...prev: copy the lastest value of formData
            ...prev,
            [name]: (name === 'numOfLike' || name === 'numOfBookmark') ? Number(value) : value
        }));
    }

    // keep the input of user during upload/edit in Rich Text Editor
    const OnEditorChange = (content: string, _editor: any) => {
        setPostData(prev => ({
            // ...prev: copy the lastest value of formData
            ...prev,
            content: content
        }));
    }

    // check the input in form is valid and exist or not
    const validInput = (topic: string, author: string | null, content: string, category: string, numOfLike: number) => {
        if (topic === '' || !author || content === '' || category === '') return false;
        if (numOfLike < 0) return false;
        return true;
    }

    // base on the value of action ('' or edit or delete, '' means upload)
    // submit different HTTP request 
    // upload and edit section: check all section contains valid input
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        switch (action) {
            case '':
                if (!validInput(postData.topicName, author, postData.content, postData.category, postData.numOfLike)) {
                    alert('請檢查所有欄位已輸入且有效');
                } else {
                    try {
                        console.log(postData.content);
                        const response = await fetch(`http://localhost:3000/api/uploadPost`, {
                            method: 'post',
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({topic: postData.topicName, author, content: postData.content, category: postData.category, numOfLike: postData.numOfLike})
                        });
                        const data = await response.json();
                        if (response.ok && data.success) {
                            alert(`${data.action}成功！`);
                            navigate('/setting');
                        } else if (data.invalidToken) {
                            alert(data.message);
                            localStorage.clear();
                            navigate('/');
                        } else {
                            alert(data.message);
                        }           
                    } catch (errorMsg) {
                        console.error('上傳請求錯誤:', errorMsg);             
                    }
                }
                break;
            case 'edit':
                if (!validInput(postData.topicName, author, postData.content, postData.category, postData.numOfLike)) {
                    alert('請檢查所有欄位已輸入且有效');
                } else {
                    try {
                        const response = await fetch(`http://localhost:3000/api/editPost/${id}`, {
                            method: 'PATCH',
                            headers: {
                                'content-type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({topic: postData.topicName, author, content: postData.content, category: postData.category, numOfLike: postData.numOfLike})
                        });
                        const data = await response.json();
                        if (response.ok && data.success) {
                            alert(`${data.action}成功！`);
                            navigate('/setting');
                        } else if (data.invalidToken) {
                            alert(data.message);
                            localStorage.clear();
                            navigate('/');
                        } else {
                            alert(data.message);
                        }           
                    } catch (errorMsg) {
                        console.error('編輯請求錯誤:', errorMsg);             
                    }
                }
                break;
            case 'delete':
                try {
                    const response = await fetch(`http://localhost:3000/api/deletePost/${id}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({author})
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        alert(`${data.action}成功！`);
                        navigate('/setting');
                    } else if (data.invalidToken) {
                        alert(data.message);
                        localStorage.clear();
                        navigate('/');
                    } else {
                        alert(data.message);
                    }           
                } catch (errorMsg) {
                    console.error('刪除請求錯誤:', errorMsg);             
                }
                break;
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
                                        name='topicName'
                                        className='upload-sessionContent-items-topicbar'
                                        value={postData.topicName}
                                        placeholder='輸入標題'
                                        onChange={OnInputChange}
                                        required
                                    />
                                </div>
                                <div className='upload-sessionContent-items-select'>
                                    <select
                                        name='category'
                                        value={postData.category}
                                        onChange={OnInputChange}
                                        required
                                    >
                                        <option value=''>選擇分類</option>
                                        <option value='leetcode'>Leetcode題解</option>
                                        <option value='newtech'>最新科技</option>
                                    </select>
                                </div>
                            </div>
                            <div className='upload-sessionContent-items-content'>
                                <Editor
                                    apiKey='ox8vle1xhk5gz3408xiwtzo9yazsvj3dzhvmyix4v2ampbf6'
                                    value={postData.content}
                                    onEditorChange={OnEditorChange}
                                />
                            </div>
                            <div className='upload-sessionContent-items-content'> 
                                <div>預設點讚數(僅供測試!)</div>
                                    <input
                                        type='number'
                                        name='numOfLike'
                                        className='upload-sessionContent-items-likebar'
                                        value={postData.numOfLike}
                                        onChange={OnInputChange}
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

