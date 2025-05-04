const express = require('express');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

module.exports = function(db) {
    const router = express.Router();    
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      });

    router.post('/get-presigned-url', async (req, res) => {
        try {
            const { userid, filename, filetype } = req.body;
            const now = new Date();
            const formatTime = now.toISOString();
            const uniqueKey = `avatars/${filename}-${userid}-${formatTime}`;
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `avatars/${filename}-${userid}-${formatTime}`,
                ContentType: filetype,
            });
            const url = await getSignedUrl(s3, command, { expiresIn: 300 });
            res.status(200).json({url, uniqueKey});
        } catch (errorMsg) {
            console.error('產生預簽名URL失敗:', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }
    });

    router.post('/editAndStore-url', async (req, res) => {
        try {
            const {userid, avatarKey} = req.body;
            
            if (!userid || !avatarKey) {
                res.status(400).json({success: false, message: '缺少連結或使用者參數'})
            }
            const userscollection = db.collection('users');
            const validUser = await userscollection.findOne({username: userid});
            if (validUser) {
                await userscollection.updateOne({username: userid}, {$set: {iconURL: avatarKey}});
                res.status(200).json({success: true, message: 'url上傳成功'})
            } else {
                res.status(403).json({success: false, message: '使用者不存在'})
            }
        } catch (errorMsg) {
            console.error('上傳URL失敗', errorMsg);
            res.status(500).json({success: false, message: '伺服器發生錯誤，請稍後再試'});
        }
    })
    
    return router;
}
