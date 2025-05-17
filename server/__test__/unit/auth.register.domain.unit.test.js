// 引入要測試的 AuthService
const AuthDomain = require('../../src/domains/authDomain.js');
// 引入自定義錯誤類別
const { InputError, BusinessError } = require('../../errors/authError.js');

jest.mock('../../src/repositories/authRepository.js', () => ({
    checkExists: jest.fn(),
    create: jest.fn()
}));

const mockAuthRepository = require('../../src/repositories/authRepository.js');

describe('register', () => {
    
    beforeEach(() => {
        jest.clearAllMocks(); // 清除所有模擬函式的呼叫記錄和返回值設定
    });
    
    test('should throw BusinessError if username exist', async () => {
        const invalidData = { username: 'testuser', email: 'testuser@gmail.com', password: '!Testpassword1' };
        mockAuthRepository.checkExists.mockResolvedValue({ username: true, email: false }); // 設定模擬函式的返回值
        try {
            await AuthDomain.register(invalidData)
            fail('UserRepository.checkExists did not throw an error');
        } catch (error) {
            expect(error).toBeInstanceOf(BusinessError);
            expect(error.message).toBe('帳號已注冊');
            expect(mockAuthRepository.checkExists).toHaveBeenCalledTimes(1);
            expect(mockAuthRepository.checkExists).toHaveBeenCalledWith(invalidData.username, invalidData.email);        
        }
    })

    test('should throw BusinessError if email exist', async () => {
        const invalidData = { username: 'testuser', email: 'testuser@gmail.com', password: '!Testpassword1' };
        mockAuthRepository.checkExists.mockResolvedValue({ username: false, email: true});
        try {
            await AuthDomain.register(invalidData);
            fail('UserRepository.checkExists did not throw an error');
        } catch (error) {
            expect(error).toBeInstanceOf(BusinessError);
            expect(error.message).toBe('電郵已注冊');
            expect(mockAuthRepository.checkExists).toHaveBeenCalledTimes(1);
            expect(mockAuthRepository.checkExists).toHaveBeenCalledWith(invalidData.username, invalidData.email);
        }
    })
});
