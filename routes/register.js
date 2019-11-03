var express = require('express');
var router=express.Router();
const fileUpload = require('express-fileupload');
const app = express();
var nodemailer = require('nodemailer');
var mkdirp = require('mkdirp');
const fs = require('fs-extra');
var bcrypt = require('bcryptjs');
var session = require('express-session')


// default options
app.use(fileUpload());
const { check, validationResult } = require('express-validator');
var Page=require('../models/page');
var Category=require('../models/category');
var Product=require('../models/product');
var User=require('../models/user');
var Emailvefiry=require('../models/emailvefiry');
//for image upload

// const resizeImg = require('resize-img');



  
router.get('/singup', function (req, res) {
//   var title="";
//   var email="";
//   var message="";

// res.send(' admin add')
res.render('admin/register/singup',{
//   title:title,
//   email:email,
//   message:message
}) 
});





router.post('/singup', [
  //   check('title').not().isEmpty(),
    check('email').isEmail(),
    check('password').not().isEmpty()
  ], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }else{

      var fname=req.body.fname;
      var lname=req.body.lname;
      var email=req.body.email;
      var password=req.body.password;
    
      var token = Math.floor(Math.random() * 9000000000) + 1000000000;
      const output=`
      <p>New contact</p>
      <ul>
      <li>Name: ${req.body.fname}</li>
      <li>Email: ${req.body.email}</li>
      <li>Message: <p>Your Verify Token:${token}</p><a href="http://localhost:3000/register/verify-email/${email}/${token}">Verify Email</a> </li>


      </ul>
      `;


      // user start
    User.findOne({email: req.body.email},function (err,user){
      if(user){

        res.send('This Eamil Already Use. Try Another Email!!!');
      


            } 
            //user if conditionn check user 
      else{  
             
                  Emailvefiry.findOne({email: req.body.email},function (err,emailvefiry){
                    if (emailvefiry) {
                      Emailvefiry.findOneAndRemove({email: req.body.email},function(err,emailvefiry){
                        if (err)
                        return console.log(err);
                        if(!err) 
                        // res.json(emailvefiry)
                        console.log('Delete Data');
                        
                  
                      });
            /////
            var emailvefiry= new Emailvefiry({
              fname: fname,
              lname: lname,
              email: email,
              password: password,
              token:token,
              status: 0
            
            });
            
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
            to: email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy! ',
            html: output
            // html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+rand+">Click here to verify</a>"
            };
            
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
            console.log(error);
            } else {
            console.log('Email sent: ' + info.response);
            }
            });
            //eamil
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(emailvefiry.password, salt, function(err, hash) {
                    emailvefiry.password = hash;
                    emailvefiry.save(
            
            
              res.json(emailvefiry)
              );
                    
                });
            });
            
            /////
                    } else {
                      //////
                      var emailvefiry= new Emailvefiry({
                        fname: fname,
                        lname: lname,
                        email: email,
                        password: password,
                        token:token,
                        status: 0
                  
                      });
                  
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
                    to: email,
                    subject: 'Sending Email using Node.js',
                    text: 'That was easy! ',
                    html: output
                    // html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+rand+">Click here to verify</a>"
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                  });
                  //eamil
                      bcrypt.genSalt(10, function(err, salt) {
                          bcrypt.hash(emailvefiry.password, salt, function(err, hash) {
                              emailvefiry.password = hash;
                              emailvefiry.save(
                    
                  
                        res.json(emailvefiry)
                        );
                              
                          });
                      });
                  
                      /////
                    }
                  });

              }
    });

      /////user end


  

    }
  
    
  });
  // verify email
  router.get('/verify-email/:email/:token', function (req, res)  {
     
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
      }else{
        Emailvefiry.findOne({email: req.params.email,token: req.params.token},function (err,emailvefiry){
          if(err)
          return console.log(err);
          var fname=emailvefiry.fname;
          var lname=emailvefiry.lname;
          var email=emailvefiry.email;
          var password=emailvefiry.password;

          var user = new User({
            fname: fname,
            lname: lname,
            email: email,
            password: password,
         
            status: 0
        });
        user.save(function (err) {

              if (err)
                  return console.log(err);



             res.json(user);
            //   res.redirect('/admin/products');
          });
          Emailvefiry.findByIdAndRemove({_id:emailvefiry.id,token: emailvefiry.token},function(err,emailvefiry){
              if (err)
              return console.log(err);
              if(!err) 
              console.log('Delete Data');
              // res.send('Delete Data');
        
            });
       
       

       
        });



    

    
      }
    
      
    });

    //forget password
    router.get('/forget-password', function (req, res) {
   
              res.render('admin/register/forget',{
              //   title:title,
              //   email:email,
              //   message:message
              }) 
      });

      // forget email send
      router.post('/forget-password', function (req, res)  {
     
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
          }else{
   
              // if(err)
              // return console.log(err);

              var email=req.body.email;

              var token = Math.floor(Math.random() * 9000000000) + 1000000000;
              const output=`
              <p>New contact</p>
              <ul>
       
              <li>Email: ${req.body.email}</li>
              <li>Message: <p>Your Verify Token:${token}</p><a href="http://localhost:3000/register/verify-forget-email/${email}/${token}">Reset Password</a> </li>
        
        
              </ul>
              `;
            
           
          ///email
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
            to: email,
            subject: 'Sending Email using Node.js',
            text: 'That was easy! ',
            html: output
            // html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+rand+">Click here to verify</a>"
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
    

          Emailvefiry.findOne({email: email},function (err,emailvefiry){
            if (emailvefiry) {
              
              Emailvefiry.findByIdAndRemove({_id:emailvefiry.id,eamil: email},function(err,emailvefiry){
                if (err)
                return console.log(err);
                if(!err) 
                console.log('Delete Data');
                // res.send('Delete Data');
                        var emailvefiry= new Emailvefiry({
                  
                          email: email,
                          token:token,
                      
                    
                        });
              
              
                    emailvefiry.save(function (err) {
              
                      if (err)
                          return console.log(err);
                          res.json(emailvefiry);
                    //   res.redirect('/admin/products');
                  });
          
              });
            } else {
                        var emailvefiry= new Emailvefiry({
                  
                          email: email,
                          token:token,
                      
                    
                        });
              
              
                    emailvefiry.save(function (err) {
              
                      if (err)
                          return console.log(err);
                          res.json(emailvefiry);
                    //   res.redirect('/admin/products');
                  });

            }

          });
     
        
          }
        
          
        });
        

        //reset password view page
        router.get('/verify-forget-email/:email/:token', function (req, res)  {
     
          const errors = validationResult(req)
          if (!errors.isEmpty()) {
              return res.status(422).json({ errors: errors.array() })
            }else{
              Emailvefiry.findOne({email: req.params.email,token: req.params.token},function (err,emailvefiry){
                if(err)
                return console.log(err);
                if (emailvefiry) {
                  res.render('admin/register/update',{
                      // password:password,
                      email:emailvefiry.email,
                      token:emailvefiry.token
                    }) 
                  
                } else {
                  console.log('no record');
                  
                }
      
        
              });
      
            }
          
            
          });
      ///Update password 
      router.post('/reset-password/:email', function (req, res)  {
        // var email= req.params.email
        var password= req.body.password
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
          }else{
            Emailvefiry.find({email: req.params.email,token: req.params.token},function (err,emailvefiry){
              if(err)
              return console.log(err);

              if (emailvefiry) {
           
                        bcrypt.genSalt(10, function(err, salt) {
                          bcrypt.hash(password, salt, function(err, hash) {
                            password=hash
                                    User.findOneAndUpdate({email: req.params.email}, {password}, function (err, user) {
                                      // res.json(user)
                    
                                      });
                                 
                          });
                      });
                          
                      Emailvefiry.findOneAndRemove({email: req.params.email,token: req.params.token},function(err,emailvefiry){
                        if (err)
                        return console.log(err);
                        if(!err) 
                        res.json(emailvefiry)
                        // console.log('Delete Data');
                        // res.send('Delete Data');
                  
                      });

              } else {
                
              }
             
           
    
           
            });
    
    
    
        
    
        
          }
        
          
        });
///login
router.get('/login', function (req, res) {

    res.render('admin/register/login') 
    });

///login Route

    router.post('/login', [
        //   check('title').not().isEmpty(),
          check('email').isEmail(),
          check('password').not().isEmpty()
        ], (req, res) => {
          const errors = validationResult(req)
          if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
          }else{

            var email=req.body.email;
            var password=req.body.password;
            var session=req.session;
            
            User.findOne({ email: email }, function(err, user) {


                bcrypt.compare(password, user.password, function( err,data) {
                  session.email = req.body.email;
                  // session.status = req.body.status;
                  req.session.status = user.status
                  req.session.email = user.email
                  req.session.userid = user._id
                    if (err) {
                        throw err
                    } else if(data) {
                          if (session.status === '1') {
                            
                                  // console.log('Admin')
                              // res.send('Login As Admin');
                              res.redirect('/admin');
                          } else if (session.status === '0'){
                            // console.log('User')
                    
                            // res.send('Login As User');
                            res.redirect('/');
                     
                          }
                      // console.log(req.session);
                      // res.redirect('/');

                    }else{
                     
                        console.log("Password  Not   matches!")
                    }
                });

            });
    
        
          }
        
          
        });


    ////login for test

   

///Logout User Get Route
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});



/***********************************************Email Send*******************************************************/




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
<li>Message: ${req.body.message} '+rand'</li>


</ul>
`;



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
  text: 'That was easy! ',
  // html: output
  html: "Hello,<br> Please Click on the link to verify your email.<br><a href="+rand+">Click here to verify</a>"
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