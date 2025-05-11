const express = require('express');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/jwtVerify.js');

module.exports = function(db) {
    const router = express.Router();

    // display the post which contain the keyword
    // query val: searchQuery (searched keyword)
    router.get('/searchTopic', verifyToken, async(req, res) => {
        const searchQuery = req.query.q;
        try {
            const postsCollection = db.collection('posts');
            const regex = new RegExp(searchQuery.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
            const searchResult = await postsCollection.find({ topicName: { $regex: regex } }).toArray();
            console.log(`成功取得與 ${searchQuery} 相關的 ${searchResult.length} 則結果`);
            res.status(200).json({success: true, searchResult});
        } catch (errorMsg) {
            console.error('取得搜尋結果時發生錯誤', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
        }
    })

    // display the popular post OR post with same category
    // query val: category (category of post)
    router.get('/displayTopic', verifyToken, async(req, res) => {
        const category = req.query.category;
        let postlist;
        try {
            const postsCollection = db.collection('posts');
            if (category === 'popular') {
                // show TOP5 liked post in desc order
                postlist = await postsCollection.find({}).sort({numOfLike: -1}).limit(5).toArray();                
            } else {
                // show same category post ordered by numOfLike
                postlist = await postsCollection.find({category: category}).sort({numOfLike: -1}).toArray();
            }
            console.log(`成功載入標題，目前顯示分類為${category}`);
            res.status(200).json({success: true, postlist}); 
        } catch (errorMsg) {
            console.error("查閱主頁時資料庫查詢錯誤:", errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
        }
    });

    // display every element of according post (accordingContent), define by unique postID
    // route val: :id (ID of post)
    // query val: username (username of logined user)
    // likeStatus: boolean (define user liked the post or not)
    router.get('/displayContent/:id', verifyToken, async(req, res) => {
        const strid = req.params.id;
        if (!ObjectId.isValid(strid)) {
            return res.status(400).json({success: false, message: 'ID格式錯誤, 無權限遊覽此頁面'})
        }
        let objectid = new ObjectId(strid);
        const username = req.query.username;
        try {
            const postsCollection = db.collection('posts');
            const accordingContent = await postsCollection.findOne({_id: objectid});
            let likeStatus;
            const liked = await postsCollection.findOne({
                _id: objectid,
                likedBy: username
            });
            if (liked) {  
                likeStatus = true;
            } else {
                likeStatus = false;
            }
            return res.status(200).json({success: true, accordingContent, likeStatus});
        } catch (errorMsg) {
            return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
        }
    });

    // upload, edit and delete function
    // :id exists ? edit and delete function : upload function
    // define edit/delete by value of action (click button in the form)
    router.post('/uploadPost', verifyToken, async(req, res) => {
        const {topic, author, content, category, numOfLike} = req.body;
        if (!topic || !author || !content || !category) {
            return res.status(400).json({success: false, message: '請填寫所有欄位'});
        }
        if (typeof numOfLike !== 'number' || numOfLike < 0) {
            return res.status(400).json({success: false, message: '請填寫正確的預設點讚數'});
        }
        const postsCollection = db.collection('posts');
        console.log('收到上傳請求:', { topic, content });
        try {
            await postsCollection.insertOne({
                topicName: topic,
                author: author,
                content: content,
                category: category,
                numOfLike: numOfLike,
                likedBy: []
            })
            console.log('上傳成功！')
            return res.status(201).json({success: true, action: '上傳'})
        } catch (errorMsg) {
            console.error("上傳時資料庫查詢錯誤:", errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
        }
    });

    // edit function
    // route val: :id (ID of post)
    // check the input exist or not => check the input valid or not
    router.patch('/editPost/:id', verifyToken, async(req, res) => {
        const {id} = req.params;
        const {topic, author, content, category, numOfLike} = req.body;

        if (!topic || !content || !author || !category) {
            return res.status(400).json({success: false, message: '請填寫所有欄位'});
        }
        if (typeof numOfLike !== 'number' || numOfLike < 0) {
            return res.status(400).json({success: false, message: '請填寫正確的預設點讚數'});
        }       

        if (id && id !== 'undefined') {
            if (!ObjectId.isValid(id)) {
                return res.status(404).json({success: false, message: '文章ID格式不正確'})
            }
            let objectid = ObjectId.createFromHexString(id);
            const postsCollection = db.collection('posts');
            const accordingPost = await postsCollection.findOne({_id: objectid})
            if (author !== accordingPost.author) {
                return res.status(403).json({success: false, message: '無權限編輯此文章'});
            }
            if (!accordingPost) {
                return res.status(404).json({success: false, message: '文章不存在'});
            }
            console.log('收到編輯請求:', { topic, content, id });
            try {
                await postsCollection.updateOne({_id: objectid}, {
                    $set: {
                        topicName: topic,
                        content: content,
                        category: category,
                        numOfLike: numOfLike
                    }
                });
                console.log('編輯成功！');
                return res.status(200).json({success: true, action: '編輯'});
            } catch (errorMsg) {
                console.error("編輯時資料庫查詢錯誤:", errorMsg);
                return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
            }  
        }
    });

    // delete function
    // route val: :id (ID of post)
    // check the input exist or not => check the input valid or not
    router.delete('/deletePost/:id', verifyToken, async(req, res) => {
        const {id} = req.params;
        const {author} = req.body;
        if (id && id !== 'undefined') {
            if (!ObjectId.isValid(id)) {
                return res.status(404).json({success: false, message: '文章ID格式不正確'})
            }
            let objectid = ObjectId.createFromHexString(id);
            const postsCollection = db.collection('posts');
            const accordingPost = await postsCollection.findOne({_id: objectid})
            if (author !== accordingPost.author) {
                return res.status(403).json({success: false, message: '無權限編輯此文章'});
            }
            if (!accordingPost) {
                return res.status(404).json({success: false, message: '文章不存在'});
            }
            console.log('收到刪除請求:', {id});
            try {
                await postsCollection.deleteOne({_id: objectid});
                console.log('刪除成功！')
                return res.status(200).json({success: true, action: '刪除'});
            } catch (errorMsg) {
                console.error("刪除時資料庫查詢錯誤:", errorMsg);
                return res.status(500).json({success: false, message: '伺服器發生錯誤, 請稍後再試'});
            }             
        }
    });

    return router;
}