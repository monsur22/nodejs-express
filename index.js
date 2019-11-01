var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
const { check, validationResult } = require('express-validator');
var nodemailer = require('nodemailer');
// app.use( express.static( "public" ) );//for image link public folder
// var expressValidator = require('express-validator');
// var config = require('./config/database');

//mongodb connection
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log('connect mongodb');

});

// Express validator middleware
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//         , root    = namespace.shift()
//         , formParam = root;
  
//       while(namespace.length) {
//         formParam += '[' + namespace.shift() + ']';
//       }
//       return {
//         param : formParam,
//         msg   : msg,
//         value : value
//       };
//     }
//   }));

//express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// set the view engine to ejs
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs');

///public folder
app.use(express.static(path.join(__dirname, 'public')));

//express file upload middleware
app.use(fileUpload());
//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// express sesson  middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
  }))
// app.get('/', (req, res) => res.send('Hello World!'));
// app.get('/', (req, res) => res.render('index'));
var home=require('./routes/home');
var admin=require('./routes/admin');
var register=require('./routes/register');


//home route
app.use('/',home);
//admin route
app.use('/admin',admin);
//register route
app.use('/register',register);



//header category list
var Category=require('./models/category');


Category.find(function (err, categories) {
  if (err) {
      console.log(err);
  } else {
      app.locals.categories = categories;
   
  }
});


///header category list

var port = 3000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));