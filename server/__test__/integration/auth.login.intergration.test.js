const request = require('supertest'); // 導入 supertest
const { app, startServer, client, connectDB } = require('../../server'); // 導入您的 Express 應用實例 (根據實際路徑調整)

let server;
let testDb;
let testDbName;

describe('POST /register', () => {

    beforeAll(async () => {
        testDbName = `blogDatabase_test_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`; // 確保連接至一個完全隨機命名的db
        testDb = await connectDB(testDbName); // 等待資料庫連接和路由掛載完成
        server = startServer(0); // 啟動server
        await new Promise(resolve => server.on('listening', resolve)); // 確保在beforeAll結束前server已經啟動
        console.log('伺服器準備就緒，資料庫已連接，路由已掛載。'); // 添加日誌確認
    });

    // 在每個測試執行前清理資料庫
    beforeEach(async () => {
        await testDb.collection('users').deleteMany({
             $or: [
                 {username: { $regex: /^loginTestUser_/ }}, // 刪除所有以 loginTestUser_ 開頭的用戶
                 {email: { $regex: /^test_/ }} // 刪除所有以 test_ 開頭的電郵
             ]
         });
         const usersCount = await testDb.collection('users').countDocuments({});
         console.log(`Before test (after cleanup): Users in DB: ${usersCount}`); // 添加日誌確認清理結果
    });

    // 在每個測試案例後清理資料庫
    afterEach(async () => {
        // 清理在測試中創建的用戶數據
        // await testDb.collection('users').deleteMany({
        //     $or: [
        //         {username: { $regex: /^loginTestUser_/ }}, // 刪除所有以 loginTestUser_ 開頭的用戶
        //         {email: { $regex: /^test_/ }} // 刪除所有以 test_ 開頭的電郵
        //     ]
        // });
    });

    afterAll(async () => {
        if (startServer) { // 假設您的 server.js 導出了 server 實例
            await new Promise(resolve => server.close(resolve));
            console.log('HTTP server closed.');
        }
        if (client && client.topology && client.topology.isConnected()) {
             await client.close();
             console.log('MongoDB client closed.');
        }
    })

    test('it should return 200 because the login success', async () => {
        const successUsername = `loginTestUser_123`;
        const successPassowrd = '!Password123';

        await testDb.collection('users').insertOne({
            username: successUsername,
            password: successPassowrd
        })     
        
        const response = await request(app)
            .post('/api/login')
            .send({
                username: successUsername,
                password: successPassowrd
            })
            .expect(200);
            
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', '登錄成功');
        expect(response.body).toHaveProperty('userId');
        expect(response.body).toHaveProperty('token'); 
        // expect(typeof response.body.token).toBe('string');
        // expect(response.body.token.length).toBeGreaterThan(0);                   
    })

    test('it should return 401 because the password is wrong', async () => {
        const wrongUsername = `loginTestUser_123`;
        const wrongPassowrd = '!Password123';

        await testDb.collection('users').insertOne({
            username: wrongUsername,
            password: '!Password456'
        })

        const response = await request(app)
            .post('/api/login')
            .send({
                username: wrongUsername,
                password: wrongPassowrd
            })
            .expect(401);
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '密碼不正確');
    })

    test('it should return 404 because username is not exist', async() => {
        const notExistUsername = `loginTestUser_123`;
        const notExistPassowrd = '!Password123';
        const response = await request(app)
            .post('/api/login')
            .send({
                username: notExistUsername,
                password: notExistPassowrd
            })
            .expect(404);

        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '用戶不存在');
    })

    test('it should return 400 because username is invalid', async() => {
        const invalidUsername = 'testuse';
        const invalidPassword = '!Password123';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/login') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '用戶名格式不符合要求');
    });      
    
    test('it should return 400 because password is invalid', async() => {
        const invalidUsername = `loginTestUser_123`;
        const invalidPassword = 'password123';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/login') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '密碼格式不符合要求');
    });    

    test('it should return 400 because username is empty', async() => {
        const invalidUsername = '';
        const invalidPassword = '!Password123';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/login') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '缺少必要欄位');
    });         

    test('it should return 400 because password is empty', async() => {
        const invalidUsername = `loginTestUser_123`;
        const invalidPassword = '';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/login') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '缺少必要欄位');
    });            
});