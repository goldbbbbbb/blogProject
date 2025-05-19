const { connectDB, startServer } = require('./server'); // 引入 server.js 中導出的函式

const PORT = process.env.PORT || 3000; // 從環境變數或使用預設值獲取埠號

async function bootstrap() {
  try {
    // 連接資料庫 (路由已在 connectDB 內部掛載)
    await connectDB();
    console.log('資料庫連接成功，路由已掛載。');

    // 啟動伺服器
    startServer(PORT);
    console.log(`應用程式在埠號 ${PORT} 上啟動。`);

  } catch (error) {
    console.error('應用程式啟動失敗:', error);
    process.exit(1); // 啟動失敗時退出進程
  }
}

bootstrap(); // 呼叫啟動函式