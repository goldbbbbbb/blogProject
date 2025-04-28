const express = require('express');

module.exports = function(db) {
    const router = express.Router();

    router.post('/login', async (req, res) => {
        const { username, password } = req.body; 
        console.log('收到登入請求:', { username, password }); 

        try {
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ username: username });
            if (user && user.password === password) {
              console.log('登入成功:', username);
              res.json({ success: true, message: 'Login successful', userId: username});
            } else {
              console.log('登入失敗: 無效的憑證', username);
              res.status(401).json({ success: false, message: 'Invalid username or password' });
            }
          } catch (errorMsg) {
            console.error("登入時資料庫查詢錯誤:", errorMsg);
            res.status(500).json({ success: false, message: 'Internal server error during login' });
        }
    });

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
                res.json({ success: true, message: 'register successful' });
            } else if (existUsername) {
                console.log('帳號已注冊');
                res.status(401).json({ success: false, message: 'registered account' });
            } else if (existEmail) {
                console.log('電郵已注冊');
                res.status(401).json({ success: false, message: 'registered email' });                
            }
        } catch (err) {
            console.error("登入時資料庫查詢錯誤:", err);
            res.status(500).json({ success: false, message: 'Internal server error during login' });
        }       
    });

    return router;
}
