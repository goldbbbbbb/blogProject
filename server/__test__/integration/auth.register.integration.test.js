const request = require('supertest'); // 導入 supertest
const { app, startServer, client, connectDB } = require('../../server'); // 導入您的 Express 應用實例 (根據實際路徑調整)
// 可能還需要導入資料庫連接或清理函數

let server;
let db;

describe('POST /register', () => {

    beforeAll(async () => {
        await connectDB(); // 等待資料庫連接和路由掛載完成
        db = client.db('blogDatabase'); // 根據您的實際資料庫名稱修改
        server = startServer(0);
        console.log('伺服器準備就緒，資料庫已連接，路由已掛載。'); // 添加日誌確認
    }, 20000);

    // 在每個測試執行前清理資料庫
    beforeEach(async () => {
        console.log('Before test: Cleaning up database...'); // 添加日誌
        // 在每個測試開始前，確保清理掉所有測試數據
        await db.collection('users').deleteMany({
             $or: [
                 {username: { $regex: /^registerTestUser_/ }}, // 刪除所有以 registerTestUser_ 開頭的用戶
                 {email: { $regex: /^test_/ }} // 刪除所有以 test_ 開頭的電郵
             ]
         });
         const usersCount = await db.collection('users').countDocuments({});
         console.log(`Before test (after cleanup): Users in DB: ${usersCount}`); // 添加日誌確認清理結果
    }, 20000);

    // 在每個測試案例後清理資料庫
    afterEach(async () => {
        // 清理在測試中創建的用戶數據
        await db.collection('users').deleteMany({
            $or: [
                {username: { $regex: /^registerTestUser_/ }}, // 刪除所有以 registerTestUser_ 開頭的用戶
                {email: { $regex: /^test_/ }} // 刪除所有以 test_ 開頭的電郵
            ]
        });
    }, 20000);

    afterAll(async () => {
        if (startServer) { // 假設您的 server.js 導出了 server 實例
            await new Promise(resolve => server.close(resolve));
            console.log('HTTP server closed.');
        }
        if (client && client.topology && client.topology.isConnected()) {
             await client.close();
             console.log('MongoDB client closed.');
        }
    }, 20000)

    test('應該成功註冊一個新用戶並返回 201 狀態碼', async () => {
        // 準備測試數據 (使用隨機數據確保唯一性)
        const testUsername = `registerTestUser_${Date.now()}`;
        const testEmail = `test_${Date.now()}@example.com`;
        const testPassword = 'Password123!';

        // 使用 supertest 發送 POST 請求
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: testUsername,
                email: testEmail,
                password: testPassword
            })
            .expect(201); // 預期 HTTP 狀態碼是 201

        // 驗證響應體內容
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('message', '注冊成功');
    });

    test('it should return 409 because user exist', async() => {
        // 準備測試數據 (使用隨機數據確保唯一性)
        const existUsername = 'registerTestUser_123';
        const existEmail = 'test_123@example.com';
        const existPassword = 'Password123!';

        await db.collection('users').insertOne({
            username: existUsername,
            email: existEmail,
            password: existPassword
        });

        // 使用 supertest 發送 POST 請求
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: existUsername,
                email: existEmail,
                password: existPassword
            })
            .expect(409); // 預期 HTTP 狀態碼是 201

        // 驗證響應體內容
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '帳號已注冊');        
    });

    test('it should return 409 because email exist', async() => {
        // 準備測試數據 (使用隨機數據確保唯一性)
        const existUsername = 'registerTestUser_123';
        const existEmail = 'test_123@example.com';
        const existPassword = 'Password123!';
        const existUsername2 = 'registerTestUser_456';

        await db.collection('users').deleteOne({ username: existUsername });
        await db.collection('users').deleteOne({ username: existUsername2 });
        await db.collection('users').deleteOne({ email: existEmail });
        
        await db.collection('users').insertOne({
            username: existUsername2,
            email: existEmail,
            password: existPassword
        });
        console.log('Test setup: InsertOne completed.');

        // *** 添加驗證步驟：立即查詢剛剛插入的用戶 ***
        console.log(`Test setup: Verifying inserted user with email: ${existEmail}`);

        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('Test setup: Added 50ms delay.');

        const insertedUser = await db.collection('users').findOne({ email: existEmail });
        // 使用斷言確保用戶被找到
        expect(insertedUser).not.toBeNull();
        expect(insertedUser.email).toBe(existEmail);
        console.log('Test setup: Verification successful. User found.');
        // *** 驗證步驟結束 ***

        // 使用 supertest 發送 POST 請求
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: existUsername,
                email: existEmail,
                password: existPassword
            })
            .expect(409);

        // 驗證響應體內容
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '電郵已注冊');
    });
    
    test('it should return 400 because username is invalid', async() => {
        const invalidUsername = `test`;
        const invalidEmail = `test_123@example.com`;
        const invalidPassword = 'Password123!';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                email: invalidEmail,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '用戶名格式不符合要求');
    });

    test('it should return 400 because email is invalid', async() => {
        const invalidUsername = `registerTestUser_123`;
        const invalidEmail = `test_123example.com`;
        const invalidPassword = 'Password123!';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                email: invalidEmail,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '電郵格式不符合要求');
    });
    
    test('it should return 400 because password is invalid', async() => {
        const invalidUsername = `registerTestUser_123`;
        const invalidEmail = `test_123@example.com`;
        const invalidPassword = 'Password123';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                email: invalidEmail,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '密碼格式不符合要求');
    });    

    test('it should return 400 because username is empty', async() => {
        const invalidUsername = '';
        const invalidEmail = `test_123@example.com`;
        const invalidPassword = 'Password123';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                email: invalidEmail,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '缺少必要欄位');
    }); 
    
    test('it should return 400 because email is empty', async() => {
        const invalidUsername = `registerTestUser_123`;
        const invalidEmail = '';
        const invalidPassword = 'Password123';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                email: invalidEmail,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '缺少必要欄位');
    });            

    test('it should return 400 because password is empty', async() => {
        const invalidUsername = `registerTestUser_123`;
        const invalidEmail = `test_123@example.com`;
        const invalidPassword = '';
        const response = await request(app) // 將 app 實例傳給 supertest
            .post('/api/register') // 指定測試的路由
            .send({ // 發送請求體數據
                username: invalidUsername,
                email: invalidEmail,
                password: invalidPassword
            })
            .expect(400); 
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message', '缺少必要欄位');
    });            

});