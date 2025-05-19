const path = require('path'); // 引入 path 模組

// 獲取專案根目錄的絕對路徑
// __dirname 是當前檔案 (jest.setup.js) 所在的目錄
// path.resolve(__dirname, '..') 會向上跳一層，到達專案根目錄
const rootPath = path.resolve(__dirname, '..');

// 載入位於專案根目錄的 .env 檔案
require('dotenv').config({ path: path.resolve(rootPath, '.env') });