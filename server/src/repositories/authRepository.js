let db;
const jwt = require('jsonwebtoken');
const Password = require('../../utils/password.utils.js')

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
    const hashedPassword = await Password.hashPassword(password);
    const newUser = {
        username: username, 
        email: email,    
        password: hashedPassword, 
        iconURL: '',
        profile: {
          birthday: '', 
          education: '',
          gender: '',   
          summary: '',  
          workexperience: ''
        }  
    };
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne(newUser);
    const createdUser = { _id: result.insertedId, ...newUser }
    return createdUser;
  },

  // check the user exist or not => compare the input match with DB or not
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
    // compare the hashed password in db & user password input
    console.log(existUser.password);
    let matchPassword = await Password.verifyHashedPassword(password, existUser.password);
    console.log('matchresult:', matchPassword);
    return {
      existUser: true,
      matchPassword: matchPassword
    }
  },

  async login(username) {
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ username });
    const JWT_SECRET = process.env.JWT_SECRET;
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