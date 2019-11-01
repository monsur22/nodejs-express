var mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    title: {
      type: String,
      // unique: true,
    },
    desc: {
      type: String,
      // unique: true,
    },
  
  });
//   const User = mongoose.model('User', userSchema);
  const Category =module.exports= mongoose.model('Category', CategorySchema);
