const AuthService = require('../services/authService.js');
const { InputError, BusinessError } = require('../../errors/authError.js');

module.exports = {
    async register(req, res) {
        try {
            const data = req.body;
            const result = await AuthService.register(data);
            res.status(result.status).json(result.body);            
        } catch (error) {
            if (error instanceof InputError) {
                console.error('註冊輸入錯誤:', error.message);
                // Output Error.status: InputError set as 400
                res.status(error.status).json({ success: false, message: error.message });
            } else if (error instanceof BusinessError) {
                 console.error('註冊業務錯誤:', error.message);
                 // Output Error.status: BusinessError set as 400
                 res.status(error.status).json({ success: false, message: error.message });
            } else {
                // Unexpected Error
                console.error('註冊時發生未預期錯誤:', error);
                res.status(500).json({ success: false, message: '伺服器發生錯誤，請稍後再試' });
            }
        }    
    }
}