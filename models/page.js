var mongoose = require('mongoose');

const PageSchema = new mongoose.Schema({
    title: {
      type: String,
      // unique: true,
    },
    email: {
      type: String,
      // unique: true,
    },
    message: {
      type: String,
      // unique: true,
    },
  });
//   const User = mongoose.model('User', userSchema);
  const Page =module.exports= mongoose.model('Page', PageSchema);
