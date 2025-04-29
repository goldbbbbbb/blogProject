import React, { useState } from 'react';
import Header from '../../components/Header';
import './Upload.css';

const Uploadpage = () => {

    const [topic, setTopic] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [numOfLike, setNumOfLike] = useState<number>(0);

    const onTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTopic(event.target.value);
    }
    const onContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

        if (!category) {
            alert('請填寫類型');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/upload', {
                method: 'post',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({topic, content, category, numOfLike})
            });
            const data = await response.json();
            if (data.success) {
                alert('上傳成功！');
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
                                    />
                                </div>
                                <div className='upload-sessionContent-items-select'>
                                    <select
                                        id='category'
                                        value={category}
                                        onChange={onCategoryChange}
                                    >
                                        <option value=''>選擇分類</option>
                                        <option value='leetcode'>Leetcode題解</option>
                                        <option value='newtech'>最新科技</option>
                                    </select>
                                </div>
                            </div>
                            <div className='upload-sessionContent-items-content'>
                                <input
                                    type='textarea'
                                    id='content'
                                    className='upload-sessionContent-items-contentarea'
                                    placeholder='輸入內容'
                                    value={content}
                                    onChange={onContentChange}
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
                                <button className='upload-sessionContent-items-submitButton'>提交</button>
                            </div>
                        </form>
                </div>
            </div>
        </>
    )
}

export default Uploadpage;

