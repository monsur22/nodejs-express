var mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title: {
      type: String,
      // unique: true,
    },
  
    category: {
      type: String,
      // unique: true,
    },
    price: {
      type: Number,
      // unique: true,
    },
    image: {
      type: String,
      // unique: true,
    },
    desc: {
      type: String,
      // unique: true,
    },
    status: {
      type: String,
      // unique: true,
    },
  
  });
//   const User = mongoose.model('User', userSchema);
  const Product =module.exports= mongoose.model('Product', ProductSchema);
