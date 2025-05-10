import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface EditPasswordComponentProps {
    updateSection: (section: string) => void;
}

const EditPasswordComponent = ({updateSection}: EditPasswordComponentProps) => {
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const userid = localStorage.getItem('userid');
    const token = localStorage.getItem('token');

    const navigate = useNavigate();

    const OnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        switch (name) {
            case 'oldPassword':
                setOldPassword(event.target.value);
                break;
            case 'newPassword':
                setNewPassword(event.target.value);
                break;
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        try {
            const response = await fetch ('http://localhost:3000/api/editPassword', {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({userid, oldPassword, newPassword})
            });
            const data = await response.json();
            if (response.ok && data.success) {
                alert('修改密碼成功，請重新登錄');
                localStorage.clear();
                navigate('/');
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
        <>
            <button onClick={() => updateSection('profile')}>回到用戶設定</button>
            <form onSubmit={handleSubmit}>
                <div>輸入密碼</div>
                <input type='password' name='oldPassword' value={oldPassword} onChange={OnInputChange} placeholder='舊密碼'></input>
                <div>輸入新密碼</div>
                <input type='password' name='newPassword' value={newPassword} onChange={OnInputChange} placeholder='新密碼'></input>
                <button>提交</button>
            </form>
        </>
    )
}

export default EditPasswordComponent;