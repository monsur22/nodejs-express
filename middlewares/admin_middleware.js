var session = require('express-session');
var User = require('../models/user');
module.exports = function(req,res,next) {
    if (req.session.status === '1') {
        next();
    } else {
        res.send('Only Admin can access This Route!');
    }
}