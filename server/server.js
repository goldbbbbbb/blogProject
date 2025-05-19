require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const createAuthRouter = require('./src/routes/auth.js');
const postRoutes = require('./src/routes/post.js');
const likeRoutes = require('./src/routes/like.js');
const settingRoutes = require('./src/routes/setting.js');
const avatarRoutes = require('./src/routes/avatar.js');
const commentRoutes = require('./src/routes/comment.js');

const mongoURI = 'mongodb://localhost:27017';
const client = new MongoClient(mongoURI);
let db;
let server;

async function connectDB(dbName = 'blogDatabase') {
    try {
      await client.connect();
      console.log("成功連接到本地 MongoDB!"); // 這個日誌現在只會在 connectDB 被呼叫時打印
      db = client.db(dbName);
      // 在這裡掛載路由，確保在資料庫連接後進行
      // 這樣在測試中呼叫 connectDB 後，路由也會被掛載
      app.use('/api', createAuthRouter(db));
      app.use('/api', postRoutes(db));
      app.use('/api', likeRoutes(db));
      app.use('/api', settingRoutes(db));
      app.use('/api', avatarRoutes(db));
      app.use('/api', commentRoutes(db));

      return db;
      
    } catch (err) {
      console.error("連接本地 MongoDB 失敗:", err);
      // 在測試環境中，我們可能不希望 process.exit(1)，而是讓測試失敗
      // 但對於應用程式正常啟動，保留 process.exit(1) 是合理的
      if (process.env.NODE_ENV !== 'test') {
          process.exit(1);
      } else {
          throw err; // 在測試中拋出錯誤
      }
    }
  }

function startServer(port) {
  // 確保只有在伺服器未啟動時才啟動
  if (!server || !server.listening) {
      server = app.listen(port, () => {
          console.log(`後端伺服器正在監聽 http://localhost:${port}`);
          console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID);
          console.log('AWS_REGION:', process.env.AWS_REGION);
          console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME);
      });
  }
  return server;
}

// 中介軟體
app.use(cors());
app.use(express.json());

// 掛載路由模組
// 所有來自 './routes/auth' 的路由都會以 '/api' 作為前綴
// 例如 auth.js 中的 router.post('/login', ...) 會對應到 '/api/login'

module.exports = { app, client, startServer, connectDB };