var express = require('express');
var router=express.Router();
const fileUpload = require('express-fileupload');
const app = express();
var nodemailer = require('nodemailer');
const Admin = require('../middlewares/admin_middleware');

// default options
app.use(fileUpload());
const { check, validationResult } = require('express-validator');
var Page=require('../models/page');
var Category=require('../models/category');
var Product=require('../models/product');
//for image upload
var mkdirp = require('mkdirp');
const fs = require('fs-extra');
// const resizeImg = require('resize-img');

// router.get('/', function (req, res) {
//     res.send(' admin page')
//   })
router.get('/', (req, res) => res.render('admin/index'));
  
router.get('/add', function (req, res) {
  var title="";
  var email="";
  var message="";

// res.send(' admin add')
res.render('admin/add',{
  title:title,
  email:email,
  message:message
}) 
});



router.post('/add', [
  check('title').not().isEmpty(),
  check('email').isEmail(),
  check('message').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }else{
    var title=req.body.title;
    var email=req.body.email;
    var message=req.body.message;
  
    var page= new Page({
      title: title,
      email: email,
      message: message
    });
    page.save(
   
      // res.redirect('/admin/add')
      res.send(' Save Data')
      );
  }

  
})

router.get('/list', function (req, res) {
 Page.find({}).sort({sorting:1}).exec(function (err,pages){
  res.render('admin/list',{
    pages:pages
  }) 

 })


});

router.get('/edit/:_id', function (req, res) {
 Page.findOne({_id: req.params._id},function (err,page){
   if(err)
   return console.log(err);

   res.render('admin/edit',{
    title: page.title, //1st title variable || page.title from database variable
    email: page.email,
    message: page.message,
    id: page._id
  }) 
  // res.send(' Save Data')

 });



});

router.post('/update/:id', [
  check('title').not().isEmpty(),
  check('email').isEmail(),
  check('message').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }else{
    var title=req.body.title;
    var email=req.body.email;
    var message=req.body.message;
    var id=req.body.id;
  
    
    Page.findOneAndUpdate({_id:req.params.id}, req.body, function (err, page) {
      res.send('data update');
    });

  }

  
});


  
 router.get('/delete/:id', function (req, res) {
  
  Page.findByIdAndRemove({_id:req.params.id},
  
    function(err,page){
      if(!err) 
      // console.log(data);
      res.send('Delete Data');

    });
  
});

/***********************************************category Route*******************************************************/

router.get('/category/add',Admin, function (req, res) {
  var title="";
  var desc="";


// res.send(' admin add')
res.render('admin/category/add',{
  title:title,
  desc:desc

}) 
});

router.post('/category/add', [

  check('title').not().isEmpty(),
  check('desc').not().isEmpty()

], (req, res) => {

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })

  }else{
    var title=req.body.title;
    var desc=req.body.desc;

  
    var category= new Category({
      title: title,
      desc: desc

    });
    category.save(
   
      // res.redirect('/admin/add')
      res.send(' Save Category Data')
      );
    // res.json(category);
  }

  
})

router.get('/category/list', function (req, res) {
  Category.find({}).sort({sorting:1}).exec(function (err,categorys){
      res.render('admin/category/list',{
        categorys:categorys
      }) 

  })

});

router.get('/category/edit/:_id', function (req, res) {
 Category.findOne({_id: req.params._id},function (err,category){
   if(err)
   return console.log(err);

   res.render('admin/category/edit',{
    title: category.title, //1st title variable || page.title from database variable
    desc: category.desc,
    // message: category.message,
    id: category._id
  }) 
  // res.send(' Save Data')

 });



});

router.post('/category/update/:id', [
  check('title').not().isEmpty(),
 
  check('desc').not().isEmpty()
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }else{
    var title=req.body.title;
    var desc=req.body.desc;
 
    var id=req.body.id;
  
    
    Category.findOneAndUpdate({_id:req.params.id}, req.body, function (err, category) {
      res.send('data update');
    });

  }

  
});


  
 router.get('/category/delete/:id', function (req, res) {
  
  Category.findByIdAndRemove({_id:req.params.id},
  
    function(err,category){
      if(!err) 
      // console.log(data);
      res.send('Delete Data');

    });
  
});

// *************************************************************product*********************************************

router.get('/product/add', function (req, res) {
  var title="";
  // var category="";

  var title = "";
  var desc = "";
  var price = "";
  // var status="";
  Category.find(function (err, categories){

    res.render('admin/product/add',{
      title: title,
      desc: desc,
      categories: categories,
      price: price
    
    }) 
})

// res.send(' admin add')

});

router.post('/product/add', function (req, res){


    var title = req.body.title;
    var desc = req.body.desc;
    var price = req.body.price;
    var category = req.body.category;

    let image = req.files.image;
    var uploadPath= '/product_images/'+ image.name;
    // var uploadPath = 'public/product_images/' + product._id + '/' +  image.name;

                var product = new Product({
                    title: title,
            
                    desc: desc,
                    price: price,
                    category: category,
                    image: uploadPath
                });

                 

                product.save(function (err) {
                //   mkdirp('public/product_images/' + product._id, function (err) {
                //     return console.log(err);
                // });

                    if (err)
                        return console.log(err);

                      image.mv('public/product_images/'+ image.name, function(err) {
                  res.send('File uploaded!');
                });

                  //  res.json(product);
                  //   res.redirect('/admin/products');
                });
      
});


router.get('/product/list', function (req, res) {
  Product.find({}).exec(function (err,product){
      res.render('admin/product/list',{
        product:product
      }) 

  })

});

router.get('/product/edit/:_id', function (req, res) {
 
    Category.find(function (err, categories){
      Product.findOne({_id: req.params._id},function (err,product){
        if(err)
        return console.log(err);
     
        res.render('admin/product/edit',{
         title: product.title, //1st title variable || page.title from database variable
         desc: product.desc,
         price: product.price,
        //  category:category,
        categories: categories,
        category: product.category,
         image: product.image,
         id: product._id
       }) 
       // res.send(' Save Data')
     
      });
  
  })
  
  
  });



router.post('/product/update/:id', function (req, res) {


  var title = req.body.title;
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;
  var pimage = req.body.pimage;
  var id = req.params.id;
  let image = req.files.image;
  var uploadPath= '/product_images/'+ image.name;

  Product.findById(id, function (err, product) {
                  if (err)
                      console.log(err);

                  product.title = title;
     
                  product.desc = desc;
                  product.price = price;
                  product.category = category;
                 
                  product.image = uploadPath;


                  product.save(function (err) {
                      if (err)
                          console.log(err);

                      if (image != "") {
                          if (pimage != "") {
                            fs.unlink('public/'+ pimage,function(err){
                              if(err) return console.log(err);
                        
                          
                         });  
                          }

               
                          image.mv('public/product_images/'+ image.name, function(err) {
                            return console.log(err);
                          });
                      }

                      res.send(product);
                  });

              });



});


  
 router.get('/product/delete/:id', function (req, res) {

    Product.findByIdAndRemove({_id:req.params.id},
      function(err,product){
        if(!err) 
        fs.unlink('public/'+ product.image,function(err){
          if(err) return console.log(err);
            res.send('Delete Data');
      
     });  
        // res.send('Delete Data');
  
      });
  // });

  
});
/*********************Email Send************************ */
router.get('/email', function (req, res) {
  var title="";
  var email="";
  var message="";

// res.send(' admin add')
res.render('admin/email',{
  title:title,
  email:email,
  message:message
}) 
});

router.post('/email', function (req, res) {
  // console.log(req.body);
  var add=req.body.email;
  var rand = Math.floor(Math.random() * 9000000000) + 1000000000;

const output=`
<p>New contact</p>
<ul>
<li>Name: ${req.body.title}</li>
<li>Email: ${req.body.email}</li>
<li>Message: ${req.body.message} </li>
<li>code: ${rand} </li>
</ul>
`;


// var transport = nodemailer.createTransport({
//   host: "smtp.mailtrap.io",
//   port: 2525,

//   auth: {
//     user: "21bd6816b55811",
//     pass: "98836e3d670b56"
//   }

// });
// var mailOptions = {
//   from: '21bd6816b55811',
//   to: 'monsurahmedshafiq@gmail.com',
//   subject: 'Sending Email using Node.js',
//   text: 'That was easy!',
//   html: output
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//     res.render('email',{msg:'Email sent'});
//   }
// });
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'tmwebdevtest@gmail.com',
    pass: 'me@web4test'
  }
});

var mailOptions = {
  from: 'tmwebdevtest@gmail.com',
  // to: 'monsurahmedshafiq@gmail.com',
  to: add,
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  html: output
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
});
//export
module.exports=router;