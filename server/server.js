const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

// 導入身份驗證路由模組
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const likeRoutes = require('./routes/like');
const settingRoutes = require('./routes/setting');

const mongoURI = 'mongodb://localhost:27017/blogDatabase';
const client = new MongoClient(mongoURI);
let db;

async function connectDB() {
    try {
      await client.connect();
      console.log("成功連接到本地 MongoDB!");
      db = client.db();
      // 接下來可以將 db 傳遞給需要操作資料庫的模組
      // app.use('/api', authRoutes(db)); // 假設 authRoutes 修改為接收 db
  
    } catch (err) {
      console.error("連接本地 MongoDB 失敗:", err);
      process.exit(1); // 連接失敗時退出應用程式
    }
    // 注意：在伺服器應用中，通常保持連接打開
  }

// 中介軟體
app.use(cors()); // 允許來自所有來源的跨域請求 (在開發中通常足夠)
app.use(express.json()); // 解析請求主體中的 JSON 資料

// 掛載路由模組
// 所有來自 './routes/auth' 的路由都會以 '/api' 作為前綴
// 例如 auth.js 中的 router.post('/login', ...) 會對應到 '/api/login'
// 啟動伺服器
connectDB().then(() => {
    app.use('/api', authRoutes(db));
    app.use('/api', postRoutes(db));
    app.use('/api', likeRoutes(db));
    app.use('/api', settingRoutes(db));
    app.listen(port, () => {
      console.log(`後端伺服器正在監聽 http://localhost:${port}`);
    });
  }).catch(err => {
    // 如果 connectDB 內部有未處理的 reject，這裡會捕獲
    console.error("啟動過程中連接資料庫失敗:", err);
    process.exit(1);
  });