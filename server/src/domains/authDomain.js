const AuthRepository = require('../repositories/authRepository.js');
const { InputError, BusinessError } = require('../../errors/authError.js');

module.exports = {
    async register(data) {
        // main logic check: username and email exist in db or not
        const { username, email } = data;
        console.log(`[AuthService Register] Checking existence for username: ${username}, email: ${email}`);
        const exists = await AuthRepository.checkExists(username, email);
        console.log(`[AuthService Register] checkExists returned: ${JSON.stringify(exists)}`);
        if (exists.username) {
            throw new BusinessError('帳號已注冊', 'USERNAME_EXISTS', 409); 
        }
        if (exists.email) {
            throw new BusinessError('電郵已注冊', 'EMAIL_EXISTS', 409); 
        }
        // if both not exist, call repository to add the user into db
        const newUser = await AuthRepository.create(data);
        return newUser;
    },

    async login(data) {
        // main logic check: username exist in db? => password match in db?
        const { username, password } = data;
        const loginProcess = await AuthRepository.loginValidation(username, password);
        if (!loginProcess.existUser) {
            throw new BusinessError('用戶不存在', 'USER_NOTEXISTS', 404);
        }
        if (!loginProcess.matchPassword) {
            throw new BusinessError('密碼不正確', 'PASSWORD_WRONG', 401);
        }
        const token = await AuthRepository.login(username);
        console.log(token, username);
        return { token, username };
    }
}