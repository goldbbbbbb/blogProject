// 1. 環境設定
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
// @ts-expect-error
global.TextDecoder = TextDecoder;

// 2. 初始化 fetch mock (必須在所有 import 之前)
global.fetch = jest.fn();
global.alert = jest.fn();
global.console.error = jest.fn();

// 3. 測試主體
import { useNavigate } from 'react-router-dom';
import ManageFormData from '../components/ManageFormData';
import { act, renderHook } from '@testing-library/react';

// 4. 正確的 mock 方式 (重要修改)
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate, // 使用同一個 mock 實例
}));

// 5. 被測試函數保持不變
async function testRegistration(validateAll: () => boolean) {
  const navigate = useNavigate();

  if (!validateAll()) {
    alert('請檢查所有輸入均已符合格式');
  } else {
    try {
      const response = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'testuser',
          email: 'test@example.com',
          password: '!Aa123456'
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        navigate('/success');
      } else {
        alert(data.message);
      }
    } catch (errorMsg) {
      console.error('登入請求錯誤:', errorMsg);
    }        
  }
}

// 6. 測試案例 (重要修改)
describe('testRegistration', () => {
  const mockFetch = global.fetch as jest.Mock;
  const mockAlert = global.alert as jest.Mock;
  const mockConsoleError = global.console.error as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return false when any field is empty', async () => {
    const { result } = renderHook(() => ManageFormData());
    act(() => {
      result.current.setFormData({
        username: '',
        email: 'test@example.com',
        password: 'Valid123!',
      });
    });
    const validinput = result.current.validateAll();
    expect(validinput).toBe(false);
  });

  test('should return false when username is not valid', async () => {
    const { result } = renderHook(() => ManageFormData());
    act(() => {
      result.current.setFormData({
        username: 'test123',
        email: 'test@example.com',
        password: 'Valid123!',
      });
    });
    const validinput = result.current.validateAll();
    expect(validinput).toBe(false);
  });  

  test('should return false when email is not valid', async () => {
    const { result } = renderHook(() => ManageFormData());
    act(() => {
      result.current.setFormData({
        username: 'test1234',
        email: 'testexample.com',
        password: 'Valid123!',
      });
    });
    const validinput = result.current.validateAll();
    expect(validinput).toBe(false);
  });  

  test('should return false when password is not valid', async () => {
    const { result } = renderHook(() => ManageFormData());
    act(() => {
      result.current.setFormData({
        username: 'test1234',
        email: 'test@example.com',
        password: 'Valid123',
      });
    });
    const validinput = result.current.validateAll();
    expect(validinput).toBe(false);
  });  
  
  test('should return true when all input is exist and valid', async () => {
    const { result } = renderHook(() => ManageFormData());
    act(() => {
      result.current.setFormData({
        username: 'test1234',
        email: 'test@example.com',
        password: 'Valid123!',
      });
    });
    const validinput = result.current.validateAll();
    expect(validinput).toBe(true);
  });    

  test('當API返回success時應跳轉到/success', async () => {
    // 設置success: true, response.ok
    const mockValidateAll = jest.fn().mockReturnValue(true);
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });
    
    await testRegistration(mockValidateAll);
    
    // 驗證順序很重要！
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/success');
  });

  test('當返回success: fail時應alert錯誤訊息', async () => {
    // 設置success: false
    const mockValidateAll = jest.fn().mockReturnValue(true);
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ success: false, message: 'there is some error' })
    });
    
    await testRegistration(mockValidateAll); 
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockAlert).toHaveBeenCalledWith('there is some error');
  });

  test('當返回network error時應console error錯誤訊息', async () => {
    const mockValidateAll = jest.fn().mockReturnValue(true);
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    await testRegistration(mockValidateAll);
    expect(mockConsoleError).toHaveBeenCalledTimes(1);
  });

});