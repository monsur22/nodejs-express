var mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fname: {
      type: String,
      // unique: true,
    },
  
    lname: {
      type: String,
      // unique: true,
    },
    email: {
      type: String,
      // unique: true,
    },
    password: {
      type: String,
      // unique: true,
    },
    status: {
      type: String,
      // unique: true,
    },
  
  });
//   const User = mongoose.model('User', userSchema);
  const User =module.exports= mongoose.model('User', UserSchema);
