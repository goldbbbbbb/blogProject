import React from 'react';
import { post } from '../../types/Post';

const PostContentSession = (
    ({
        content,
        likeStatus,
        updatedLike,
        onLike
    }: {
        content: post,
        likeStatus: boolean,
        updatedLike: post | undefined,
        onLike: () => void
    }) => {

    return (
        <>
            <div className='contentPage-topic'>{content.topicName}</div>
            <div className='contentPage-text'>{content.content}</div>
            <div className='contentPage-clicklike-container'>
                <img className='contentPage-clicklike-icon' onClick={onLike} src={likeStatus === true ? '/thumbs-up.png' : '/thumbs-up-grey.png'}></img>
                {updatedLike ? (
                    <div>{updatedLike.numOfLike}</div> ) : (
                        <div>{content.numOfLike}</div>
                    )
                }
            </div>     
        </>     
    )
})

export default PostContentSession;