const express = require('express');
const { ObjectId } = require('mongodb');

module.exports = function(db) {
    const router = express.Router();

    router.get('/searchTopic', async(req, res) => {
        const searchQuery = req.query.q;
        console.log(searchQuery);
        try {
            const usersCollection = db.collection('posts');
            const regex = new RegExp(searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
            const searchResult = await usersCollection.find({ topicName: { $regex: regex } }).toArray();
            console.log(`成功取得與 ${searchQuery} 相關的 ${searchResult.length} 則結果`);
            res.status(200).json({success: true, searchResult});
        } catch (errorMsg) {
            console.error('取得搜尋結果時發生錯誤', errorMsg);
            res.status(500).json({success: false, errorMsg});
        }
    })

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
            console.error("查閱主頁時資料庫查詢錯誤:", errorMsg);
            res.status(500).json({success: false, message: {errorMsg}});
        }
    });

    router.get('/displayContent/:id', async(req, res) => {
        const strid = req.params.id;
        let objectid = new ObjectId(strid);

        const username = req.query.username;
        try {
            const usersCollection = db.collection('posts');
            const accordingContent = await usersCollection.findOne({_id: objectid});
            let likeStatus = undefined;
            const liked = await usersCollection.findOne({
                _id: objectid,
                likedBy: { $elemMatch: { username: username } }
            });
            if (liked) {  
                likeStatus = true;
            } else {
                likeStatus = false;
            }
            res.status(200).json({success: true, accordingContent, likeStatus});
        } catch (errorMsg) {
            res.status(500).json({success: false, message: {errorMsg}});
        }
    });

    router.post('/upload/:id', async(req, res) => {
        const { topic, author, content, category, numOfLike, action } = req.body;
        const strid = req.params.id;
        const usersCollection = db.collection('posts'); 
        if (strid && strid !== 'undefined') {
            let objectid = new ObjectId(strid);
            if (action === 'edit') {
                console.log('收到編輯請求:', { topic, content, strid });
                try {
                    await usersCollection.updateOne({_id: objectid}, {
                        $set: {
                            topicName: topic,
                            content: content,
                            category: category,
                            numOfLike: numOfLike
                        }
                    });
                    console.log('編輯成功！');
                    res.status(200).json({success: true, 已編輯貼文: topic, action: 'edit'});
                } catch (errorMsg) {
                    console.error("編輯時資料庫查詢錯誤:", errorMsg);
                    res.status(500).json({success: false, message: {errorMsg}});
                }  
            } else if (action === 'delete') {
                console.log('收到刪除請求:', { topic, content, strid });
                try {
                    await usersCollection.deleteOne({_id: objectid});
                    console.log('刪除成功！')
                    res.status(200).json({success: true, 已刪除貼文: topic, action: 'delete'});
                } catch (errorMsg) {
                    console.error("刪除時資料庫查詢錯誤:", errorMsg);
                    res.status(500).json({success: false, message: {errorMsg}});
                }                
            }        
        } else {
            console.log('收到上傳請求:', { topic, content });
            try {
                await usersCollection.insertOne({
                    topicName: topic,
                    author: author,
                    content: content,
                    category: category,
                    numOfLike: numOfLike,
                    likedBy: []
                })
                console.log('上傳成功！')
                res.status(200).json({success: true, 已上傳貼文: topic, action: 'upload'})
            } catch (errorMsg) {
                console.error("上傳時資料庫查詢錯誤:", errorMsg);
                res.status(500).json({success: false, message: {errorMsg}});
            }  
        }
    })

    return router;
}