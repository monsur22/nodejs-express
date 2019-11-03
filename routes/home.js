var express = require('express');
var router=express.Router();
const fileUpload = require('express-fileupload');
const app = express();
var session = require('express-session');

app.use(fileUpload());
const { check, validationResult } = require('express-validator');
var Page=require('../models/page');
var Category=require('../models/category');
var Product=require('../models/product');
//for image upload
var mkdirp = require('mkdirp');
const fs = require('fs-extra');

// router.get('/', function (req, res) {
//     res.send(' home page')
//   })
// router.get('/', (req, res) => res.render('index'));
// router.get('/admin', (req, res) => res.send('Admin Page'));

router.get('/', function (req, res) {
 
  var session=req.session;
  email=session.email
  console.log(session);

  res.render('index',{email:email});

 


});

//******************home all product ***************
router.get('/all-product', function (req, res) {
    Product.find().exec(function (err,product){
        res.render('all_product',{
          product:product
        }) 
        console.log(req.session);
  
    })
  
  });
  
/***********product by category*************/
router.get('/product-by-category/:title', function (req, res) {
  var categorytitle = req.params.title;

Category.findOne({title:categorytitle},function (err, categories) {
  Product.find({category:categorytitle}).exec(function (err,product){
    res.render('product_by_category',{
      product:product,
      title:categories.title
    }) 

})
})
});

/***********product details by id*************/
router.get('/product-details-by-id/:_id', function (req, res) {
 
 
    // Category.find(function (err, categories){
      Product.findOne({_id: req.params._id},function (err,product){
        if(err)
        return console.log(err);
     
        res.render('product_details_by_id',{
          product:product


       }) 

     
      });
  
  // })
  
  
  });
//export
module.exports=router;