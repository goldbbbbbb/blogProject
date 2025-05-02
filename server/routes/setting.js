const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    // get the post history of user
    // query val: username
    router.get('/setting', async(req, res) => {
        try {
            const username = req.query.username;
            const postsCollection = db.collection('posts');
            const postHistory = await postsCollection.find({author: username}).toArray();
            if (postHistory) {
                console.log(`已取得 ${username} 的歷史貼文`);
                return res.status(200).json({success: true, postHistory})
            }
        } catch (errorMsg) {
            return res.status(500).json({success: false, message: {errorMsg}});
        }
    })

    return router;
}