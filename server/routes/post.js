const express = require('express');
const like = require('./like');

module.exports = function(db) {
    const router = express.Router();

    router.get('/displayTopic', async(req, res) => {
        const category = req.query.category;
        let postlist;
        try {
            const usersCollection = db.collection('posts');
            if (category === 'popular') {
                postlist = await usersCollection.find({}).sort({numOfLike: -1}).limit(3).toArray();                
            } else {
                postlist = await usersCollection.find({category: category}).sort({numOfLike: -1}).toArray();
            }
            console.log(`成功載入標題，目前顯示分類為${category}`);
            res.status(200).json({success: true, postlist}); 
        } catch (errorMsg) {
            console.error("登入時資料庫查詢錯誤:", errorMsg);
            res.status(500).json({success: false, message: {errorMsg}});
        }
    });

    router.get('/displayContent/:topic', async(req, res) => {
        const topic = req.params.topic;
        const username = req.query.username;
        try {
            const usersCollection = db.collection('posts');
            const accordingContent = await usersCollection.findOne({topicName: topic});
            let likeStatus = false;
            const liked = await usersCollection.findOne({
                topicName: topic,
                likedBy: { $elemMatch: { username: username } }
            });
            if (liked) {  
                likeStatus = true;
            }
            res.status(200).json({success: true, accordingContent, likeStatus});
        } catch (errorMsg) {
            res.status(500).json({success: false, message: {errorMsg}});
        }
    });

    router.post('/upload', async(req, res) => {
        const { topic, content, category, numOfLike } = req.body; 
        console.log('收到上傳請求:', { topic, content }); 
        try {
            const usersCollection = db.collection('posts');
            await usersCollection.insertOne({
                topicName: topic,
                content: content,
                category: category,
                numOfLike: numOfLike,
                likedBy: []
            })
            console.log('上傳成功！')
            res.status(200).json({success: true, 已上傳標題: topic})
        } catch (errorMsg) {
            console.error("登入時資料庫查詢錯誤:", errorMsg);
            res.status(500).json({success: false, message: {errorMsg}});
        }
    })

    return router;
}