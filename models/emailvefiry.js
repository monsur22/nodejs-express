var mongoose = require('mongoose');

const EmailvefirySchema = new mongoose.Schema({
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
    token: {
      type: String,
      // unique: true,
    },
    status: {
      type: String,
      // unique: true,
    },
  
  });
//   const User = mongoose.model('User', userSchema);
  const Emailvefiry =module.exports= mongoose.model('Emailvefiry', EmailvefirySchema);
