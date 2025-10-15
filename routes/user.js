const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectURL } = require('../middleware');
const users = require('../controllers/users');

// signup routes

router.route('/signup').get((req, res) => {
    res.render('users/signup.ejs');
}).post(wrapAsync(users.signup));

// Login routes

router.route('/login').get((req, res) => {
    res.render('users/login.ejs');
}).post(saveRedirectURL, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// Logout route
router.get('/logout', users.logout);

module.exports = router;