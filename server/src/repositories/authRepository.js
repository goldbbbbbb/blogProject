let db;

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
  }
}