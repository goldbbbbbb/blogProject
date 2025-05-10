import React from 'react';
import { user } from '../../../types/User';

interface IconComponentProps {
    userData: user | null;
    currIcon: string;
    updateSection: (section: string) => void;
}

// userData must exist as parent component proved it exist
const IconComponent = ({userData, currIcon, updateSection}: IconComponentProps) => {
    return (
        <div className='userProfile-session-container'>
            <img className='usericon' src={userData?.iconURL === ''? '/defaultIcon.png' : currIcon}></img>
            <button onClick={() => updateSection('uploadOrEditIcon')}>更改頭像</button>
        </div>
    )
}

export default IconComponent;