import React, { useState } from 'react';
import Header from '../../components/Header';

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
          // 處理網路錯誤或其他 fetch 過程中發生的錯誤
          console.error('登入請求錯誤:', errorMsg);             
        }
    }
    return (
        <>
            <Header />
            <form onSubmit={handleSubmit}>
                <div>輸入標題</div>
                <input
                    type='text'
                    id='topic'
                    value={topic}
                    onChange = {onTopicChange}
                >
                </input>
                <div>輸入內容</div>
                <input
                    type='textarea'
                    id='content'
                    value={content}
                    onChange = {onContentChange}
                >
                </input>
                <div>輸入類型</div>
                <select
                    id='category'
                    value={category}
                    onChange={onCategoryChange}
                >
                    <option value=''>請選擇</option>
                    <option value='leetcode'>Leetcode題解</option>
                    <option value='newtech'>最新科技</option>
                </select>
                <div>預設點讚數(僅供測試!)</div>
                <input
                    type='number'
                    id='numoflike'
                    value={numOfLike}
                    onChange={onNumOfLikeChange}
                >
                </input>
                <button>提交</button>
            </form>
        </>
    )
}

export default Uploadpage;

