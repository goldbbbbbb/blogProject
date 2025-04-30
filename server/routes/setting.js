const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    router.get('/setting', async(req, res) => {
        try {
            const username = req.query.username;
            console.log(username);
            const usersCollection = db.collection('posts');
            const postHistory = await usersCollection.find({author: username}).toArray();
            const count = await usersCollection.countDocuments({});
            console.log(postHistory);
            if (postHistory) {
                console.log(`已取得 ${username} 的歷史 ${count} 則貼文`);
                res.status(200).json({success: true, postHistory})
            }
        } catch (errorMsg) {
            res.status(500).json({success: false, message: {errorMsg}});
        }
    })

    return router;
}