const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('收到的 token:', token);
    if (!token) {
      return res.status(401).json({success: false, invalidToken: true, message: '未提供認證令牌' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('JWT 驗證失敗:', error);
      return res.status(401).json({success: false, invalidToken: true, message: '無效的令牌' });
    }
  };
  
  module.exports = verifyToken;