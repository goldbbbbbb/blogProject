require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/post');
const likeRoutes = require('./routes/like');
const settingRoutes = require('./routes/setting');
const avatarRoutes = require('./routes/avatar');
const commentRoutes = require('./routes/comment');

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
      process.exit(1);
    }
  }

// 中介軟體
app.use(cors());
app.use(express.json()); // 解析請求主體中的 JSON 資料

// 掛載路由模組
// 所有來自 './routes/auth' 的路由都會以 '/api' 作為前綴
// 例如 auth.js 中的 router.post('/login', ...) 會對應到 '/api/login'
connectDB().then(() => {
    app.use('/api', authRoutes(db));
    app.use('/api', postRoutes(db));
    app.use('/api', likeRoutes(db));
    app.use('/api', settingRoutes(db));
    app.use('/api', avatarRoutes(db));
    app.use('/api', commentRoutes(db));
    
    app.listen(port, () => {
      console.log(`後端伺服器正在監聽 http://localhost:${port}`);
      console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
      console.log('AWS_REGION:', process.env.AWS_REGION);
      console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);
    });
  }).catch(err => {
    console.error("啟動過程中連接資料庫失敗:", err);
    process.exit(1);
  });