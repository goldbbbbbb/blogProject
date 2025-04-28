import React from 'react';

interface ContentListprops {
    users: any[];
    moveToContent: (topic: string) => void;
}

// display Posts in Homepage
const ContentList = ({ users, moveToContent }: ContentListprops) => (
  <div className="homepage-content-topic-container">
    {users.length > 0 ? (
      users.map((post) => (
        <div className="homepage-content-topic-item-container" key={post._id}>
          <button
            onClick={() => moveToContent(post.topicName)}
            className="homepage-content-topic-item-text"
          >
            {post.topicName}
          </button>
          <div className="homepage-content-topic-item-star-container">
            <img
              className="homepage-content-topic-item-star-photo"
              alt="like"
              src="/thumbs-up.png"
            />
            <div className="homepage-content-topic-item-star-text">
              {post.numOfLike}
            </div>
          </div>
        </div>
      ))
    ) : (
      <div>目前沒有用戶數據或正在載入...</div>
    )}
  </div>
);

export default ContentList;