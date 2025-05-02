const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    // login function: if username exists on the DB and the password is match, approve the login request
    router.post('/login', async (req, res) => {
        const { username, password } = req.body; 
        console.log('收到登入請求:', { username, password }); 

        try {
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ username: username });
            if (user && user.password === password) {
              console.log('登入成功:', username);
              return res.status(200).json({ success: true, message: '登入成功', userId: username});
            } else {
              console.log('登入失敗: 用戶名不存在', username);
              return res.status(401).json({ success: false, message: '無效的用戶名或密碼' });
            }
          } catch (errorMsg) {
            console.error("登入時資料庫查詢錯誤:", errorMsg);
            return res.status(500).json({ success: false, message: 'Internal server error during login' });
        }
    });

    // register function: if username or email not exist in the db, approve the register request
    router.post('/register', async (req, res) => {
        const { username, email, password } = req.body; 
        console.log('收到注冊請求:', { username, email, password }); 
        try {
            const usersCollection = db.collection('users');
            const existUsername = await usersCollection.findOne({ username: username });
            const existEmail = await usersCollection.findOne({ email: email });
            if (!existUsername && !existEmail) {
                await usersCollection.insertOne({
                    username: username,
                    email: email,
                    password: password
                })
                console.log('注冊成功！');
                return res.status(201).json({ success: true, message: '注冊成功' });
            } else if (existUsername) {
                console.log('帳號已注冊');
                return res.status(409).json({ success: false, message: '帳號已注冊' });
            } else if (existEmail) {
                console.log('電郵已注冊');
                return res.status(409).json({ success: false, message: '電郵已注冊' });                
            }
        } catch (errorMsg) {
            console.error("注冊時資料庫查詢錯誤:", errorMsg);
            return res.status(500).json({ success: false, message: 'Internal server error during login' });
        }       
    });

    return router;
}
