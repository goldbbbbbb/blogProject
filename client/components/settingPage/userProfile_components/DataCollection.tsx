import React from 'react';
import { userCollection } from '../../../types/UserCollection'; 

interface DataCollectionComponentProps {
    userDataCollection: userCollection;
}

// display the dataCollection of user
const DataCollectionComponent = ({userDataCollection}: DataCollectionComponentProps) => {
    return (
        <div className='userProfile-session-container'>
            <div className='userProfile-form-container'>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>用戶總被點讚數為</div>
                    <div className='userProfile-form-row-items'>{userDataCollection.totalLike}</div>
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>用戶總發文數為</div>
                    <div className='userProfile-form-row-items'>{userDataCollection.totalPost}</div>
                </div>
                <div className='userProfile-form-row-container'>
                    <div className='userProfile-form-row-items'>用戶總留言數為</div>
                    <div className='userProfile-form-row-items'>{userDataCollection.totalComment}</div>
                </div>
            </div>
        </div>
    )
}

export default DataCollectionComponent;