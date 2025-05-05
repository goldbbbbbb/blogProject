import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Setting.css';
import PostList from '../../components/Postlist';
import { post } from '../../types/Post';
import UserProfile from '../../components/UserProfile';
import TestPage from '../../components/EditIcon';


const Usersettingpage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('userid');
    const token = localStorage.getItem('token');
    const [postHistory, setPostHistory] = useState<post[]>([]);
    const [currSection, setCurrSection] = useState<string>('profile');

    useEffect(() => {
        const fetchPostedPost = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/setting?username=${username}`, {
                    method: 'get',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setPostHistory(data.postHistory);
                } else if (data.invalidToken) {
                    alert(data.message);
                    localStorage.clear();
                    navigate('/');
                } else {
                    alert(data.message);
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

    const updateSection = (section: string) => {
        setCurrSection(section);
    }

    return (
        <>
            <Header />
            <div className='settingpage-container'>
                <div className='settingpage-navbar-container'>
                    <button onClick={() => updateSection('profile')} className='settingpage-navbar-items'>用戶資料</button>
                    <button onClick={() => updateSection('editOrDeletePost')} className='settingpage-navbar-items'>編輯/刪除貼文</button>
                </div>
                <div className='settingpage-display-container'>
                    {currSection === 'profile' && <UserProfile updateSection={updateSection}/>}
                    {currSection === 'uploadOrEditIcon' && <TestPage updateSection={updateSection}/>}
                    {currSection === 'editOrDeletePost' && <PostList posts={postHistory} moveToContent={moveToEdit} />}
                </div>
            </div>
        </>
    )
}

export default Usersettingpage;