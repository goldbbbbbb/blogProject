let db;
const jwt = require('jsonwebtoken');

module.exports = {

  // get the db from route 
  initialize: (database) => {
    db = database;
  },

  // check the db contains user/email same with input
  async checkExists(username, email) {
    const usersCollection = db.collection('users');
    const [userByName, userByEmail] = await Promise.all([
      usersCollection.findOne({ username }),
      usersCollection.findOne({ email })
    ]);

    return {
      username: !!userByName,
      email: !!userByEmail
    };
  },

  // add user into db
  async create(data) {
    const { username, email, password } = data;
    const newUser = {
        username: username, 
        email: email,    
        password: password, 
        iconURL: '',  
        birthday: '', 
        education: '',
        gender: '',   
        summary: '',  
        workexperience: ''
    };
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(newUser);
    const createdUser = { _id: result.insertedId, ...newUser }
    return createdUser;
  },

  async loginValidation(username, password) {
    const usersCollection = db.collection('users');
    const existUser = await usersCollection.findOne({ username });
    // if user not exist, return
    if (!existUser) {
      return {
        existUser: false,
        matchPassword: false
      }
    }
    // compare the password
    let matchPassword = (existUser.password === password);
    return {
      existUser: true,
      matchPassword: matchPassword
    }
  },

  async login(username) {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });
    const JWT_SECRET = process.env.JWT_SECRET;
    console.log(JWT_SECRET);
    const token = jwt.sign(
      {
          userId: user._id,
          username: user.username
      },
      JWT_SECRET,
      {expiresIn: '24h'}
    );
    return token;
  }
}