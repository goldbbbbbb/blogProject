const express = require('express');
const verifyToken = require('../../middleware/jwtVerify.js');

module.exports = function(db) {
    const router = express.Router();

    // get the post history of user
    // query val: username
    router.get('/getHistoryPost', verifyToken, async(req, res) => {
        try {
            const username = req.query.username;
            const postsCollection = db.collection('posts');
            const postHistory = await postsCollection.find({author: username}).toArray();
            console.log(`已取得 ${username} 的 ${postHistory.length} 條歷史貼文`);
            return res.status(200).json({success: true, postHistory});
        } catch (errorMsg) {
            console.error('取得貼文失敗', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }
    })

    // get the bookmarked list of user
    // query val: username
    router.get('/getBookmarkedPost', verifyToken, async(req, res) => {
        try {
            const username = req.query.username;
            const postsCollection = db.collection('posts');
            const bookmarkedPostlist = await postsCollection.find({bookmarkedBy: username}).toArray();
            console.log(`已取得 ${username} 的 ${bookmarkedPostlist.length} 條收藏貼文`);
            return res.status(200).json({success: true, bookmarkedPostlist});
        } catch (errorMsg) {
            console.error('取得貼文失敗', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }
    })


    // get the info of user
    // query val: username
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

    // edit the info of user
    // query val: username
    // those element are optional, no need to check exist or not
    router.patch('/editUserInfo', verifyToken, async (req, res) => {
        const {gender, birthday, summary, workexperience, education, userid} = req.body;
        try {
            const userscollection = db.collection('users');
            const userData = await userscollection.findOne({username: userid});
            if (!userData) {
                res.status(403).json({success: false, message: '使用者不存在'});
            } else {
                await userscollection.updateOne({username: userid}, {$set: {
                    gender: gender,
                    birthday: birthday,
                    summary: summary,
                    workexperience: workexperience,
                    education, education
                }});
                res.status(200).json({success: true});
            }
        } catch (errorMsg) {
            console.error('修改用戶資料失敗', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }
    })

    // get the datacollection of user
    // query val: username
    router.get('/getUserDataCollection', verifyToken, async (req, res) => {
        const userid = req.query.userid;
        try {
            const userscollection = db.collection('users');
            const userData = await userscollection.findOne({username: userid});
            if (!userData) {
                return res.status(403).json({success: false, message: '使用者不存在'});
            }
            const postscollection = db.collection('posts');
            const commentscollection = db.collection('comments'); 
            const postStats = await postscollection.aggregate([{$match: {author: userid}}, {$group: {_id: null, totalPost: {$sum: 1}, totalLike: {$sum: '$numOfLike'}, totalBookmark: {$sum: '$numOfBookmark'}}}]).toArray();
            const commentStats = await commentscollection.aggregate([{$match: {username: userid }}, {$count: 'totalComment'}]).toArray();
            
            const totalLike = postStats[0]?.totalLike || 0;
            const totalPost = postStats[0]?.totalPost || 0;
            const totalBookmark = postStats[0]?.totalBookmark || 0;
            const totalComment = commentStats[0]?.totalComment || 0;
            console.log(`取得數據統計成功`);
            return res.status(200).json({success: true, totalLike, totalPost, totalComment, totalBookmark});
        } catch (errorMsg) {
            console.error('取得資料失敗', errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});            
        }
    })

    return router;
}