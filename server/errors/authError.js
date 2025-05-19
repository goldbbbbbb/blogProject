class InputError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InputError';
    this.status = 400; // 預設 HTTP 狀態碼
  }
}

class BusinessError extends Error {
  constructor(message, code, status) {
    super(message);
    this.name = 'BusinessError';
    this.code = code; // 例如 'USERNAME_EXISTS'
    this.status = status; // 預設 HTTP 狀態碼
  }
}

// 您可以在這裡定義其他自定義錯誤類型

module.exports = {
  InputError,
  BusinessError,
  // ... 導出其他錯誤
};