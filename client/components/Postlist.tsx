import React from 'react';
import { post } from '../types/Post';
import './Postlist.css';

interface ContentListprops {
    posts: post[];
    moveToContent: (id: string) => void;
}

// display Posts in according Page
const PostList = ({ posts, moveToContent }: ContentListprops) => (
  <>
    {posts.length > 0 ? (
      posts.map((post) => (
        <div className='postlist-container'>
          <button
            onClick={() => moveToContent(post._id)}
            className='postlist-item-topic'
          >
            {post.topicName}
          </button>
          <div className='postlist-item-likeAndBookmark-container'>
            <img
              className='postlist-item-likeAndBookmark-photo'
              alt='like'
              src='/thumbs-up.png'
            />
            <div className='postlist-item-likeAndBookmark-text'>
              {post.numOfLike}
            </div>
            <img
              className='postlist-item-likeAndBookmark-photo'
              alt='bookmark'
              src='/star.png'
            />
            <div className='postlist-item-likeAndBookmark-text'>
              {post.numOfBookmark}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div>目前沒有用戶數據或正在載入...</div>
    )}
  </>
);

export default PostList;