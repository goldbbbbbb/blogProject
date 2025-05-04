import React, { useState, useEffect } from 'react';
import './UserProfile.css';
import { user } from '../types/User';

interface UserProfileProps {
    updateSection: (section: string) => void;
}

const UserProfile = ({updateSection} : UserProfileProps) => {
    const [currIcon, setCurrIcon] = useState('');
    const [userData, setUserData] = useState<user | null>(null);
    const userid = localStorage.getItem('userid');

    useEffect (() => {
        if (userid) {
            const getUserInfo = async () => {
                try {
                    const response = await fetch (`http://localhost:3000/api/getUserInfo?userid=${userid}`, {
                        method: 'get'
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        setUserData(data.userData);
                        setCurrIcon(`https://blogdb-avatar.s3.ap-southeast-1.amazonaws.com/${data.userData.iconURL}`)
                    } else {
                        alert(data.message);
                    }
                } catch (errorMsg) {
                    console.error(errorMsg);
                    alert('伺服器發生錯誤，請稍後再試')
                }
            }
            getUserInfo();
        }
    }, [userid]);

    return (
        <>
            {userData ?
                    <>
                        <div className='userProfile-icon-container'>
                            <img className='usericon' src={userData.iconURL === '' ? '/defaultIcon.png' : currIcon}></img>
                            <button onClick={() => updateSection('uploadOrEditIcon')}>更改頭像</button>
                        </div>
                        <div className='userProfile-data-container'>
                            <div className='userProfile-data-form-container'>
                                <div className='userProfile-data-form-text-container'>
                                    <div className='userProfile-data-form-text-items'>用戶ID</div>
                                    <div className='userProfile-data-form-text-items'>{userData._id}</div>
                                </div>
                                <div className='userProfile-data-form-text-container'>
                                    <div className='userProfile-data-form-text-items'>用戶名</div>
                                    <div className='userProfile-data-form-text-items'>{userData.username}</div>
                                </div>
                                <div className='userProfile-data-form-text-container'>
                                    <div className='userProfile-data-form-text-items'>電郵</div>
                                    <div className='userProfile-data-form-text-items'>{userData.email}</div>
                                </div>
                                <div className='userProfile-data-form-text-container'>
                                    <div className='userProfile-data-form-text-items'>密碼</div>
                                    <button className='userProfile-data-form-text-items'>修改密碼</button>
                                </div>
                            </div>
                        </div>                
                    </>
                :
                    <div>檢測不到userid</div>
            }
        </>
    )
}

export default UserProfile;