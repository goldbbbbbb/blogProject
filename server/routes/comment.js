const express = require('express');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/jwtVerify.js');

module.exports = function(db) {
    const router = express.Router();

    router.get('/displayCommentSession', verifyToken, async(req, res) => {
        const postId = req.query.postId;
        if (!postId) {
            return res.status(400).json({success: false, message: 'ID不存在'});
        }
        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({success: false, message: 'ID格式錯誤, 無權限遊覽此頁面'});
        }
        try {
            let objectid = ObjectId.createFromHexString(postId);
            const postsCollections = db.collection('posts');
            const commentsCollections = db.collection('comments');
            const validPosts = await postsCollections.findOne({_id: objectid})
            if (!validPosts) {
                return res.status(404).json({success: false, message: '文章不存在'});
            }
            const now = new Date();
            const commentList = await commentsCollections.find({postId: objectid}).toArray();
            return res.status(200).json({success: true, time: now, commentList});
        } catch (errorMsg) {
            console.error ('載入留言區時發生錯誤', errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});            
        }
    })

    router.post('/submitComment', verifyToken, async(req, res) => {
        const {id, username, userIcon, comment} = req.body;
        if (!id || !username || !userIcon || !comment) {
            return res.status(400).json({success: false, message: '缺少必要欄位'});
        }
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({success: false, message: 'ID格式錯誤, 無權限遊覽此頁面'})
        }
        try {
            let objectid = ObjectId.createFromHexString(id);
            const usersCollections = db.collection('users');
            const postsCollections = db.collection('posts');
            const commentsCollections = db.collection('comments');
            const validUsers = await usersCollections.findOne({username: username});
            if (!validUsers || validUsers.iconURL !== userIcon) {
                return res.status(404).json({success: false, message: '用戶不存在'});
            }
            const validPosts = await postsCollections.findOne({_id: objectid})
            if (!validPosts) {
                return res.status(404).json({success: false, message: '文章不存在'});
            }
            const now = new Date();
            await commentsCollections.insertOne({
                postId: objectid,
                username: username,
                userIconUrl: userIcon,
                date: now,
                content: comment
            });
            return res.status(201).json({success: true, message: '上傳留言成功'});
        } catch (errorMsg) {
            console.error ('上傳留言時發生錯誤', errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
        }
    })

    return router;
}