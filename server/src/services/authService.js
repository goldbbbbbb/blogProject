const AuthDomain = require('../domains/authDomain.js');
const { InputError, BusinessError } = require('../../errors/authError.js');
// import utils for handle the validation
const Validation = require('../../utils/validation.js')

module.exports = {
    async register(data) {
        // input check session
        const { username, email, password } = data;
        if (!username || !email || !password) {
            throw new InputError('缺少必要欄位');
        }
        if (!Validation.username(username)) {
            throw new InputError('用戶名格式不符合要求');
        } 
        if (!Validation.email(email)) {
            throw new InputError('電郵格式不符合要求');
        } 
        if (!Validation.password(password)) {
            throw new InputError('密碼格式不符合要求');
        }         
        try {
            // Call domain to handle the main logic
            const newUser = await AuthDomain.register(data); // 傳遞資料物件

            // If success, return the HTTP status and body
            return { status: 201, body: { success: true, message: '注冊成功', user: newUser } };

        } catch (error) {
            // catch the error from domain, let controller handle the error 
            if (error instanceof InputError || error instanceof BusinessError) {
                throw error;
            }
            // unexpected error
            throw new Error('伺服器內部錯誤'); 
        }
    },

    async login(data) {
        const { username, password } = data;
        // input check session: exist & valid?
        if (!username || !password) {
            throw new InputError('缺少必要欄位');
        }
        if (!Validation.username(username)) {
            throw new InputError('用戶名格式不符合要求');
        } 
        if (!Validation.password(password)) {
            throw new InputError('密碼格式不符合要求');
        }
        // Call for domains to handle the main logic
        try {
            const userData = await AuthDomain.login(data);
            const userId = userData.username;
            const token = userData.token;
            //success case
            return { status: 200, body: { success: true, message: '登錄成功', token: token, userId: userId }};
        } catch (error) {
            // catch the error from domain, let controller handle the error 
            if (error instanceof InputError || error instanceof BusinessError) {
                throw error;
            }
            // unexpected error
            console.error('服務層發生錯誤', error);
            throw new Error('伺服器內部錯誤'); 
        }        
    }
}