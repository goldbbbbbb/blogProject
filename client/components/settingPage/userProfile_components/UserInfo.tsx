import React, { useState } from 'react'
import { user } from '../../../types/User';
import { useNavigate } from 'react-router-dom';

interface UserInfoComponentProps {
    userData: user;
    setUserData: React.Dispatch<React.SetStateAction<user>>;
    originalUserData: user;
}

// display the userinfo
const UserInfoComponent = ({userData, setUserData, originalUserData}: UserInfoComponentProps) => {
    const [formStatus, setFormStatus] = useState('display');
    const userid = localStorage.getItem('userid');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    // when user cancel the edit, replace the data which got by the get request
    const changeStatus = (status: string) => {
        setFormStatus(status);
        if (status === 'display') {
            setUserData(originalUserData);
        }
    }

    // keep the user input during edit
    const OnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setUserData(prev => ({
            // ...prev: copy the lastest value of formData
            ...prev,
            [name]: value,
        }));
    };

    // submit the PATCH request
    // no need verify the input because those input are not required
    const onSubmit = async () => {
        try {
            const response = await fetch ('http://localhost:3000/api/editUserInfo', {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({gender: userData?.gender, birthday: userData?.birthday, summary: userData?.summary, workexperience: userData?.workexperience, education: userData?.education, userid})
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert('修改資料成功');
                window.location.reload();
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

    return (
        <div className='userProfile-session-container'>
            <div className='userProfile-form-container'>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>gender</div>
                    {formStatus === 'display'?
                        <div className='userProfile-form-row-items'>{userData?.gender}</div>
                        :
                        <input onChange={OnInputChange} name='gender' value={userData?.gender} className='userProfile-form-row-items'></input>
                    }
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>birthday</div>
                    {formStatus === 'display'?
                        <div className='userProfile-form-row-items'>{userData?.birthday}</div>
                        :
                        <input onChange={OnInputChange} name='birthday' value={userData?.birthday} className='userProfile-form-row-items'></input>
                    }
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>summary</div>
                    {formStatus === 'display'?
                        <div className='userProfile-form-row-items'>{userData?.summary}</div>
                        :
                        <input onChange={OnInputChange} name='summary' value={userData?.summary} className='userProfile-form-row-items'></input>
                    }
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>work experience</div>
                    {formStatus === 'display'?
                        <div className='userProfile-form-row-items'>{userData?.workexperience}</div>
                        :
                        <input onChange={OnInputChange} name='workexperience' value={userData?.workexperience} className='userProfile-form-row-items'></input>
                    }
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>education</div>
                    {formStatus === 'display'?
                        <div className='userProfile-form-row-items'>{userData?.education}</div>
                        :
                        <input onChange={OnInputChange} name='education' value={userData?.education} className='userProfile-form-row-items'></input>
                    }
                </div>
                {formStatus === 'display'?
                    <div className='userProfile-form-row-container'>
                        <button onClick={() => changeStatus('edit')} className='userProfile-form-row-button'>編輯</button>
                        <button disabled className='userProfile-form-row-button'>提交</button>
                    </div>
                    :
                    <div className='userProfile-form-row-container'>
                        <button onClick={() => changeStatus('display')} className='userProfile-form-row-button'>取消</button>
                        <button onClick={onSubmit} className='userProfile-form-row-button'>提交</button>
                    </div>
                }
            </div>
        </div>
    )
}

export default UserInfoComponent;