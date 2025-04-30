import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Setting.css';
import PostList from '../../components/Postlist';
import { post } from '../../types/Post';


const Usersettingpage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('userid');
    const [postHistory, setPostHistory] = useState<post[]>([]);

    useEffect(() => {
        const fetchPostedPost = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/setting?username=${username}`, {
                    method: 'get'
                });
                const data = await response.json();
                if (data.success) {
                    setPostHistory(data.postHistory);
                }
            } catch (errorMsg) {
                console.error('歷史發文請求錯誤:', errorMsg);  
            }
        }
        fetchPostedPost();
    }, []);

    const moveToEdit = (id: string) => {
        navigate(`/upload/${id}`);
    }

    return (
        <>
            <Header />
            <div className='settingpage-container'>
                <div className='settingpage-navbar-container'>
                    <div className='settingpage-navbar-items'>Edit/delete post</div>
                </div>
                <div className='settingpage-display-container'>
                    <PostList posts={postHistory} moveToContent={moveToEdit} />
                </div>
            </div>
        </>
    )
}

export default Usersettingpage;