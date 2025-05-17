const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const verifyToken = require('../../middleware/jwtVerify.js');
const AuthController = require('../controllers/authControllers.js');
const AuthRepository = require('../repositories/authRepository.js');

const createAuthRouter = (db) => {
    const router = express.Router();
    const JWT_SECRET = process.env.JWT_SECRET;
    AuthRepository.initialize(db);

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

    // editPasword function
    // verify the input exist or not => verify the password valid or not
    // verify the user exist or not
    // verify the password exist or not
    router.patch('/editPassword', verifyToken, async (req, res) => {
        const {userid, oldPassword, newPassword} = req.body;
        
        if (!userid || oldPassword === '' || newPassword === '') {
            return res.status(400).json({success: false, message: '缺少必要欄位'});
        }

        if (!validatePassword(oldPassword) || !validatePassword(newPassword)) {
            console.error('密碼格式不符合要求')
            return res.status(400).json({success: false, message: '密碼格式不符合要求'});              
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
        AuthController.register(req, res);   
    });

    return router;
}

module.exports = createAuthRouter;
