import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import './Setting.css';
import PostList from '../../components/Postlist';
import { post } from '../../types/Post';
import UserProfile from '../../components/settingPage/UserProfile';
import EditIconComponent from '../../components/settingPage/userProfile_components/EditIcon';
import EditPasswordComponent from '../../components/settingPage/userProfile_components/EditPassword';


const Usersettingpage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('userid');
    const token = localStorage.getItem('token');
    const [postHistory, setPostHistory] = useState<post[]>([]);
    const [bookmarkedPostlist, setBookmarkedPostlist] = useState<post[]>([]);
    const [currSection, setCurrSection] = useState<string>('profile');

    // get the posthistory of user
    useEffect(() => {
        const fetchPostedPost = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getHistoryPost?username=${username}`, {
                    method: 'get',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.success) {
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

    // get the bookmarked postlist of user
    useEffect(() => {
        const fetchBookmarkedPost = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getBookmarkedPost?username=${username}`, {
                    method: 'get',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (response.ok && data.success) {
                    setBookmarkedPostlist(data.bookmarkedPostlist);
                } else if (data.invalidToken) {
                    alert(data.message);
                    localStorage.clear();
                    navigate('/');
                } else {
                    alert(data.message);
                }
            } catch (errorMsg) {
                console.error('收藏請求錯誤:', errorMsg);  
            }
        }
        fetchBookmarkedPost();
    }, []);

    const moveToEdit = (id: string) => {
        navigate(`/upload/${id}`);
    }

    const moveToPost = (id: string) => {
        navigate(`/content/${id}`);
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
                    <button onClick={() => updateSection('bookmarkedPostlist')} className='settingpage-navbar-items'>查閱收藏內容</button>
                </div>
                <div className='settingpage-display-container'>
                    {currSection === 'profile' && <UserProfile updateSection={updateSection}/>}
                    {currSection === 'uploadOrEditIcon' && <EditIconComponent updateSection={updateSection}/>}
                    {currSection === 'editOrDeletePost' && <PostList posts={postHistory} moveToContent={moveToEdit} />}
                    {currSection === 'bookmarkedPostlist' && <PostList posts={bookmarkedPostlist} moveToContent={moveToPost}/>}
                    {currSection === 'editPassword' && <EditPasswordComponent updateSection={updateSection}/>}
                </div>
            </div>
        </>
    )
}

export default Usersettingpage;