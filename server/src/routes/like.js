const express = require('express');
const { ObjectId } = require('mongodb');
const verifyToken = require('../../middleware/jwtVerify.js');

module.exports = function(db) {
    const router = express.Router();

    // add/minus the num of like base on the user in the likeBy array or not
    // route val: strid (id of post)
    router.patch('/addNumOfLike/:id', verifyToken, async(req, res) => {
        const strid = req.params.id;
        if (!ObjectId.isValid(strid)) {
            return res.status(400).json({success: false, message: 'ID格式錯誤, 無權限遊覽此頁面'})
        }
        let objectid = new ObjectId(strid);
        const {username} = req.body;

        try {
            const postsCollection = db.collection('posts');
            const liked = await postsCollection.findOne({_id: objectid, likedBy: username});
            if (liked) {
                await postsCollection.updateOne({_id: objectid}, {$inc: {numOfLike: -1}, $pull: {likedBy: username}});
                console.log(`成功為 ${objectid} 的內容取消讚`);    
            } else {
                await postsCollection.updateOne({_id: objectid}, {$inc: {numOfLike: 1}, $addToSet: {likedBy: username}}); 
                console.log(`成功為 ${objectid} 的內容點讚`);
            }
            const searchResult = await postsCollection.findOne({_id: objectid}, {projection:{numOfLike: 1, _id: 0}});
            const numOfLike = searchResult.numOfLike;
            console.log(`成功為 ${strid} 的內容點/移除讚`);
            return res.status(200).json({success: true, numOfLike});
        } catch (errorMsg) {
            console.error("按讚時資料庫更新錯誤:", errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
        }        
    });

    // add/minus the num of bookmark base on the user in the bookmarkedby array or not
    // route val: strid (id of post)
    router.patch('/addNumOfBookmark/:id', verifyToken, async(req, res) => {
        const strid = req.params.id;
        if (!ObjectId.isValid(strid)) {
            return res.status(400).json({success: false, message: 'ID格式錯誤, 無權限遊覽此頁面'})
        }
        let objectid = new ObjectId(strid);
        const {username} = req.body;

        try {
            const postsCollection = db.collection('posts');
            const bookmarked = await postsCollection.findOne({_id: objectid, bookmarkedBy: username});
            if (bookmarked) {
                await postsCollection.updateOne({_id: objectid}, {$inc: {numOfBookmark: -1}, $pull: {bookmarkedBy: username}});
                console.log(`已取消收藏 ${objectid} 的內容`);    
            } else {
                await postsCollection.updateOne({_id: objectid}, {$inc: {numOfBookmark: 1}, $addToSet: {bookmarkedBy: username}}); 
                console.log(`已成功收藏 ${objectid} 的內容`);
            }
            const searchResult = await postsCollection.findOne({_id: objectid}, {projection:{numOfBookmark: 1, _id: 0}});
            const numOfBookmark = searchResult.numOfBookmark;
            console.log(`成功為 ${strid} 的內容加入/移除收藏`);
            return res.status(200).json({success: true, numOfBookmark});
        } catch (errorMsg) {
            console.error("按讚時資料庫更新錯誤:", errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
        }    
    });

    return router;
}