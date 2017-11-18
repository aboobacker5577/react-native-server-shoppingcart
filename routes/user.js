var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');
var Order = require('../models/order');
var Cart = require('../models/cart');
var user=require('../models/user')
const winston=require('winston');

/*
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'profile.log' })
    ]
});
*/
//var csrfProtection = csrf();
//router.use(csrfProtection);

router.post('/moblogin',function (req,res,next) {
    console.log(req.body.username);
    console.log(req.body.password);

    user.findOne({'email':req.body.username}, function (err, user){
        if(user){
            //console.log(user);
            if(!user.validPassword(req.body.password)){
                res.json({error:"error"});
            }
            else{
                res.json({message:user})
            }
        }
        else{
            res.json({error:"error"});
        }

    })
});

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user:req.user},function (err,orders){
        if(err){
            return res.write('Error');
            //logger.info('Error',+err);
        }
        var cart;
        orders.forEach(function(order){
            cart=new Cart(order.cart);
            order.items=cart.generateArray();
        });
        //console.log(orders);
        res.render('user/profile',{orders:orders});
        //logger.info('Order',req.user.email+'Profile loaded succesfully');
    });
});

router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logOut();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});


router.get('/signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('./user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});
router.post('/signin', passport.authenticate('local-signin', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl=req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});
router.get('/signup', function (req, res, next) {
    var messages = req.flash('error');
    res.render('./user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
});
router.post('/signup', passport.authenticate('local-signup', {
    //successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if (req.session.oldUrl) {
        var oldUrl=req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);

    } else {
        res.redirect('/user/profile');
    }
});


module.exports = router;

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}