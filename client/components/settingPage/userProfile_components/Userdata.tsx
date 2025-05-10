import React from 'react';
import { user } from '../../../types/User';

interface UserDataComponentProps {
    userData: user | null;
    updateSection: (section: string) => void;
}

const UserDataComponent = ({userData, updateSection}: UserDataComponentProps) => {
    return (
        <div className='userProfile-session-container'>
            <div className='userProfile-form-container'>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>用戶ID</div>
                    <div className='userProfile-form-row-items'>{userData?._id}</div>
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>用戶名</div>
                    <div className='userProfile-form-row-items'>{userData?.username}</div>
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>電郵</div>
                    <div className='userProfile-form-row-items'>{userData?.email}</div>
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>密碼</div>
                    <button onClick={() => updateSection('editPassword')} className='userProfile-form-row-items'>修改密碼</button>
                </div>
            </div>    
        </div> 
    )
}

export default UserDataComponent;