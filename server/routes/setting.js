const express = require('express');
const verifyToken = require('../middleware/jwtVerify.js');

module.exports = function(db) {
    const router = express.Router();

    // get the post history of user
    // query val: username
    router.get('/setting', verifyToken, async(req, res) => {
        try {
            const username = req.query.username;
            const postsCollection = db.collection('posts');
            const postHistory = await postsCollection.find({author: username}).toArray();
            if (postHistory) {
                console.log(`已取得 ${username} 的歷史貼文`);
                return res.status(200).json({success: true, postHistory})
            } else {
                return res.status(403).json({success: false, message: '使用者不存在'})
            }
        } catch (errorMsg) {
            console.error('取得貼文失敗', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }
    })

    router.get('/getUserInfo', verifyToken, async (req, res) => {
        const userid = req.query.userid;
        try {
            const userscollection = db.collection('users');
            const userData = await userscollection.findOne({username: userid});
            if (userData) {
                console.log('取得用戶資料成功');
                res.status(200).json({success: true, userData});
            } else {
                res.status(403).json({success: false, message: '使用者不存在'});
            }
        } catch (errorMsg) {
            console.error('取得資料失敗', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }
    })

    return router;
}