const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require('../middleware/jwtVerify.js');

module.exports = function(db) {
    const router = express.Router();
    const JWT_SECRET = process.env.JWT_SECRET;
    // verify the username, email and password input is valid or not
    function validateUsername(username) {
        return username && username.length >= 8;
      }
      
    function validateEmail(email) {
    return email && email.includes('@');
    }
    
    function validatePassword(password) {
    return password && 
            password.length >= 8 &&
            /[A-Z]/.test(password) && 
            /[a-z]/.test(password) && 
            /[0-9]/.test(password) && 
            /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    }


    // login function: if username exists on the DB and the password is match, approve the login request
    router.post('/login', async (req, res) => {
        const { username, password } = req.body; 
        console.log('收到登入請求:', { username, password }); 

        try {
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({ username: username });
            if (user && user.password === password) {
              console.log('登入成功:', username);
              const token = jwt.sign(
                {
                    userId: user._id,
                    username: user.username
                },
                JWT_SECRET,
                {expiresIn: '24h'}
              );
              return res.status(200).json({ success: true, token, message: '登入成功', userId: username});
            } else {
              console.log('登入失敗: 用戶名不存在', username);
              return res.status(401).json({ success: false, message: '無效的用戶名或密碼' });
            }
          } catch (errorMsg) {
            console.error("登入時資料庫查詢錯誤:", errorMsg);
            return res.status(500).json({ success: false, message: '伺服器發生錯誤，請稍後再試' });
        }
    });

    router.patch('/editPassword', verifyToken, async (req, res) => {
        const {userid, oldPassword, newPassword} = req.body;
        
        if (!validatePassword(oldPassword) || !validatePassword(newPassword)) {
            console.error('密碼不存在 或 密碼格式不符合要求')
            return res.status(400).json({success: false, message: '密碼不存在 或 密碼格式不符合要求'});              
        }

        try {
            const usersCollection = db.collection('users');
            const user = await usersCollection.findOne({username: userid});
            if (!user) {
                return res.status(403).json({success: false, message: '用戶不存在'});
            }
            if (user && user.password === oldPassword) {
                await usersCollection.updateOne({username: userid}, {$set: {password: newPassword}});
                return res.status(200).json({success: true})
            } else {
                return res.status(401).json({success: false, message: '無效的用戶名或密碼'});
            }            
        } catch (errorMsg) {
            console.error("注冊時資料庫查詢錯誤:", errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }       
    });

    // register function
    // check the username/email/password exist and vaild or not
    // if username or email not exist in the db, approve the register request
    router.post('/register', async (req, res) => {
        const { username, email, password } = req.body; 
        console.log('收到注冊請求:', { username, email, password }); 

        if (!validateUsername(username)) {
            console.error('用戶名不存在 或 密碼格式不符合要求')
            return res.status(400).json({success: false, message: '用戶名不存在 或 用戶名格式不符合要求'});            
        }
        if (!validateEmail(email)) {
            console.error('電郵不存在 或 電郵格式不符合要求')
            return res.status(400).json({success: false, message: '電郵不存在 或 電郵格式不符合要求'});                 
        }
        if (!validatePassword(password)) {
            console.error('密碼不存在 或 密碼格式不符合要求')
            return res.status(400).json({success: false, message: '密碼不存在 或 密碼格式不符合要求'});  
        }

        try {
            const usersCollection = db.collection('users');
            const existUsername = await usersCollection.findOne({username: username});
            const existEmail = await usersCollection.findOne({email: email});
            if (!existUsername && !existEmail) {
                await usersCollection.insertOne({
                    username: username,
                    email: email,
                    password: password
                })
                console.log('注冊成功！');
                return res.status(201).json({success: true, message: '注冊成功'});
            } else if (existUsername) {
                console.log('帳號已注冊');
                return res.status(409).json({success: false, message: '帳號已注冊'});
            } else if (existEmail) {
                console.log('電郵已注冊');
                return res.status(409).json({success: false, message: '電郵已注冊'});                
            }
        } catch (errorMsg) {
            console.error("注冊時資料庫查詢錯誤:", errorMsg);
            return res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }       
    });

    return router;
}
