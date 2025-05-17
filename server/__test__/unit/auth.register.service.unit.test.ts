// 引入要測試的 AuthService
const AuthService = require('../../src/services/authService.js');
// 引入自定義錯誤類別
const { InputError, BusinessError } = require('../../errors/authError.js');

// 模擬 UserDomain 模組，因為 Service 層依賴它
// 我們不關心 Domain 層的實際行為，只確保 Service 層正確呼叫它或處理其錯誤
jest.mock('../../src/domains/authDomain.js', () => ({
  // 模擬 register 方法
  // 在測試 Service 層的輸入驗證時，這個方法不應該被呼叫到
  // 如果被呼叫到，說明輸入驗證失敗了
  register: jest.fn(),
}));

// 在每個測試檔案開始前，獲取模擬的 Domain
const mockAuthDomain = require('../../src/domains/authDomain.js');

describe('AuthService', () => {
  // 在每個測試案例執行前，重置模擬函式的狀態
  beforeEach(() => {
    jest.clearAllMocks(); // 清除所有模擬函式的呼叫記錄和返回值設定
  });

  describe('register', () => {
    // 測試案例：驗證輸入欄位是否為空
    test('should throw InputError if username is missing', async () => {
      // 準備測試資料，缺少 username
      const invalidData = { email: 'test@example.com', password: 'password123' };

      // 使用 try...catch 來捕獲預期拋出的錯誤
      try {
        await AuthService.register(invalidData);
        // 如果沒有拋出錯誤，則測試失敗
        fail('AuthService.register did not throw an error');
      } catch (error) {
        // 驗證捕獲到的錯誤是否是 InputError 的實例
        expect(error).toBeInstanceOf(InputError);
        // 驗證錯誤訊息是否符合預期
        expect(error.message).toBe('缺少必要欄位');
        // 驗證模擬的 Domain 層方法沒有被呼叫
        expect(mockAuthDomain.register).not.toHaveBeenCalled();
      }
    });

    test('should throw InputError if email is missing', async () => {
      // 準備測試資料，缺少 email
      const invalidData = { username: 'testuser', password: 'password123' };

      try {
        await AuthService.register(invalidData);
        fail('AuthService.register did not throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InputError);
        expect(error.message).toBe('缺少必要欄位');
        expect(mockAuthDomain.register).not.toHaveBeenCalled();
      }
    });

    test('should throw InputError if password is missing', async () => {
      // 準備測試資料，缺少 password
      const invalidData = { username: 'testuser', email: 'test@example.com' };

      try {
        await AuthService.register(invalidData);
        fail('AuthService.register did not throw an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InputError);
        expect(error.message).toBe('缺少必要欄位');
        expect(mockAuthDomain.register).not.toHaveBeenCalled();
      }
    });

    test('should throw InputError if username is invalid', async () => {
      const invalidData = { username: 'baduser', email: 'test@example.com', password: '!Testuser1' };

      try {
        await AuthService.register(invalidData);
        fail('Validation.validateUsername did not throw an error')
      } catch (error) {
        expect(error).toBeInstanceOf(InputError);
        expect(error.message).toBe('用戶名格式不符合要求');
        expect(mockAuthDomain.register).not.toHaveBeenCalled();
      }
    })

    test('should throw InputError if email is invalid', async () => {
      const invalidData = { username: 'gooduser', email: 'test-example.com', password: '!Testuser1' };

      try {
        await AuthService.register(invalidData);
        fail('Validation.validateEmail did not throw an error')
      } catch (error) {
        expect(error).toBeInstanceOf(InputError);
        expect(error.message).toBe('電郵格式不符合要求');
        expect(mockAuthDomain.register).not.toHaveBeenCalled();
      }
    })

    test('should throw InputError if username is invalid', async () => {
      const invalidData = { username: 'bestuser', email: 'test@example.com', password: 'Testuser1' };

      try {
        await AuthService.register(invalidData);
        fail('Validation.validateUsername did not throw an error')
      } catch (error) {
        expect(error).toBeInstanceOf(InputError);
        expect(error.message).toBe('密碼格式不符合要求');
        expect(mockAuthDomain.register).not.toHaveBeenCalled();
      }
    })


    // 您可以添加更多測試案例來驗證其他輸入驗證規則
    // 例如：測試 email 格式是否正確 (如果 Service 層有做這個驗證)
    // test('should throw InputError if email format is invalid', async () => { ... });

    // 測試案例：驗證輸入有效時，是否正確呼叫 Domain 層
    // 這個測試案例屬於驗證 Service 層與 Domain 層的互動，可以放在輸入驗證測試之後
    test('should call UserDomain.register and return success if input is valid', async () => {
        // 準備有效的測試資料
        const validData = { username: 'testuser', email: 'test@example.com', password: '!Password123' };
        // 模擬 Domain 層成功返回的結果
        const mockNewUser = { _id: 'some-id', ...validData };
        mockAuthDomain.register.mockResolvedValue(mockNewUser); // 設定模擬函式成功時的返回值

        // 呼叫 AuthService.register
        const result = await AuthService.register(validData);

        // 驗證模擬的 Domain 層方法被正確呼叫，且傳入了正確的資料
        expect(mockAuthDomain.register).toHaveBeenCalledTimes(1);
        expect(mockAuthDomain.register).toHaveBeenCalledWith(validData);

        // 驗證 AuthService 返回的結果是否符合預期 (狀態碼和響應體)
        expect(result).toEqual({
            status: 201,
            body: { success: true, message: '注冊成功', user: mockNewUser },
        });
    });

    // 測試案例：驗證當 Domain 層拋出 BusinessError 時，Service 層是否正確重新拋出
    test('should re-throw BusinessError from UserDomain', async () => {
        const validData = { username: 'existinguser', email: 'test@example.com', password: '!Password123' };
        const businessError = new BusinessError('帳號已註冊', 'USERNAME_EXISTS');
        // 設定模擬函式拋出 BusinessError
        mockAuthDomain.register.mockRejectedValue(businessError);

        try {
            await AuthService.register(validData);
            fail('AuthService.register did not re-throw BusinessError');
        } catch (error) {
            // 驗證捕獲到的錯誤是否是 Domain 層拋出的那個 BusinessError 實例
            expect(error).toBe(businessError);
            expect(mockAuthDomain.register).toHaveBeenCalledTimes(1);
            expect(mockAuthDomain.register).toHaveBeenCalledWith(validData);
        }
    });

    // 測試案例：驗證當 Domain 層拋出未預期錯誤時，Service 層是否拋出通用錯誤
    test('should throw generic error for unexpected errors from UserDomain', async () => {
        const validData = { username: 'testuser', email: 'test@example.com', password: '!Password123' };
        const unexpectedError = new Error('Database connection failed');
        // 設定模擬函式拋出未預期錯誤
        mockAuthDomain.register.mockRejectedValue(unexpectedError);

        try {
            await AuthService.register(validData);
            fail('AuthService.register did not throw generic error');
        } catch (error) {
            // 驗證捕獲到的錯誤是否是 Service 層拋出的通用錯誤
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('伺服器內部錯誤');
            expect(mockAuthDomain.register).toHaveBeenCalledTimes(1);
            expect(mockAuthDomain.register).toHaveBeenCalledWith(validData);
        }
    });
  });
});