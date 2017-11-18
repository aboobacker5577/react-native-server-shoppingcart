var passport = require('passport');
var User = require('../models/user');
var LocalStratergy = require('passport-local');
//const winston=require('winston');
//var date=new Date();
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

passport.use('local-signin', new LocalStratergy({
    usernameField: 'email',
    passwordFiels: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            //winston.log('Login Error',date.toISOString()+ email +'not found in our account');
            return done(null, false, {message: 'No User Found'});
            //winston.log('Login Error',date.toISOString()+ email +'not found in our account');
        }
        if (!user.validPassword(password)) {
            //winston.log('Login Error',date.toISOString()+ email +'incurrect Password');
            return done(null, false, {message: 'Wrong Password'});
        }
        //winston.log('login Info',date.toISOString()+'Accesing /user'+user);
        return done(null,user);
    })
}));

passport.use('local-signup', new LocalStratergy({
    usernameField: 'email',
    passwordFiels: 'password',
    passReqToCallback: true
}, function (req, email, password,done) {
    req.checkBody('email', 'Invalid Email').notEmpty().isEmail();
    req.checkBody('password', 'Invalid password').notEmpty().isLength({min: 4});
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {message: 'Email Alredy in Use'});
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, reslt) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });

    })
}));

