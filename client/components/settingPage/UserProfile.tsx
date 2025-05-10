import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';
import { user } from '../../types/User';
import { userCollection } from '../../types/UserCollection'; 
import IconComponent from './userProfile_components/Icon';
import UserDataComponent from './userProfile_components/Userdata';
import UserInfoComponent from './userProfile_components/UserInfo';
import DataCollectionComponent from './userProfile_components/DataCollection';

interface UserProfileProps {
    updateSection: (section: string) => void;
}

const UserProfile = ({updateSection} : UserProfileProps) => {
    const defaultUser: user = {
        _id: '',
        username: '',
        email: '',
        iconURL: '',
        gender: '',
        birthday: '',
        summary: '',
        workexperience: '',
        education: ''        
    }
    const navigate = useNavigate();
    const [currIcon, setCurrIcon] = useState('');
    const [userData, setUserData] = useState<user>(defaultUser);
    const [originalUserData, setOriginalUserData] = useState<user>(defaultUser);
    const [userDataCollection, setUserDataCollection] = useState<userCollection>({totalLike: 0, totalPost: 0, totalComment: 0});
    const userid = localStorage.getItem('userid');
    const token = localStorage.getItem('token');

    useEffect (() => {
        if (userid) {
            const getUserInfo = async () => {
                try {
                    const response = await fetch (`http://localhost:3000/api/getUserInfo?userid=${userid}`, {
                        method: 'get',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        setUserData(data.userData);
                        setOriginalUserData(data.userData);
                        setCurrIcon(`https://blogdb-avatar.s3.ap-southeast-1.amazonaws.com/${data.userData.iconURL}`)
                    } else if (data.invalidToken) {
                        alert(data.message);
                        localStorage.clear();
                        navigate('/');
                    } else {
                        alert(data.message);
                    }
                } catch (errorMsg) {
                    console.error(errorMsg);
                    alert('伺服器發生錯誤，請稍後再試');
                }
            }
            getUserInfo();
        }
    }, [userid]);

    useEffect (() => {
        if (userid) {
            const getUserDataCollection = async () => {
                try {
                    const response = await fetch (`http://localhost:3000/api/getUserDataCollection?userid=${userid}`, {
                        method: 'get',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        setUserDataCollection({totalLike: data.totalLike, totalPost: data.totalPost, totalComment: data.totalComment});
                    } else if (data.invalidToken) {
                        alert(data.message);
                        localStorage.clear();
                        navigate('/');
                    } else {
                        alert(data.message);
                    }
                } catch (errorMsg) {
                    console.error(errorMsg);
                    alert('伺服器發生錯誤，請稍後再試')
                }
            }
            getUserDataCollection();
        }
    }, [userid]);

    return (
        <>
            {userData ?
                    <>
                        <IconComponent userData={userData} currIcon={currIcon} updateSection={updateSection}/>
                        <UserDataComponent userData={userData} updateSection={updateSection}/>
                        <UserInfoComponent userData={userData} setUserData={setUserData} originalUserData={originalUserData}/>
                        <DataCollectionComponent userDataCollection={userDataCollection}/>
                    </>
                :
                    <div>檢測不到userid</div>
            }
        </>
    )
}

export default UserProfile;