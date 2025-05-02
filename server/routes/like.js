const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = function(db) {
    const router = express.Router();

    // add/minus the num of like base on the user in the likeBy array or not
    // route val: strid (id of post)
    router.post('/addNumOfLike/:id', async(req, res) => {
        const strid = req.params.id;
        if (!ObjectId.isValid(strid)) {
            return res.status(400).json({success: false, message: 'ID格式錯誤，無權限遊覽此頁面'})
        }
        let objectid = new ObjectId(strid);
        const { username } = req.body;

        try {
            const usersCollection = db.collection('posts');
            const liked = await usersCollection.findOne({_id: objectid, likedBy: username});
            if (liked) {
                await usersCollection.updateOne({_id: objectid}, {$inc: {numOfLike: -1}, $pull: {likedBy: username}});
                console.log(`成功為 ${objectid} 的內容取消讚`);    
            } else {
                await usersCollection.updateOne({_id: objectid}, {$inc: {numOfLike: 1}, $addToSet: {likedBy: username}}); 
                console.log(`成功為 ${objectid} 的內容點讚`);
            }
            const updatedNumOfLike = await usersCollection.findOne({_id: objectid});
            console.log(`成功為 ${strid} 的內容點/移除讚`);
            return res.status(200).json({success: true, updatedNumOfLike});
        } catch (errorMsg) {
            console.error("按讚時資料庫更新錯誤:", errorMsg);
            return res.status(500).json({success: false, message: {errorMsg}});
        }
    })
    
    return router;
}