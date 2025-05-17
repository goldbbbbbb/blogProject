const AuthRepository = require('../repositories/authRepository.js');
const { InputError, BusinessError } = require('../../errors/authError.js');

module.exports = {
    async register(data) {
        // main logic check: username and email exist in db or not
        const { username, email } = data;
        const exists = await AuthRepository.checkExists(username, email);
        if (exists.username) {
            throw new BusinessError('帳號已注冊', 'USERNAME_EXISTS'); 
        }
        if (exists.email) {
            throw new BusinessError('電郵已注冊', 'EMAIL_EXISTS'); 
        }
        // if both not exist, call repository to add the user into db
        const newUser = await AuthRepository.create(data);
        return newUser;
    }
}