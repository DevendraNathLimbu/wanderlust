const User = require('../models/user');

module.exports.signup = async(req, res) => {
   try{
     const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to the App!');
        res.redirect(req.session.redirectURL);
    });
   } catch (error) {
       req.flash('error', 'Username or Email already taken');
       res.redirect('/signup');
   }
};

module.exports.login = (req, res) => {
    req.flash('success',"Welcome back to Wanderlust");
    res.redirect(res.locals.redirectURL || '/listings');
};

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.flash('success', "You have logged out!");
        res.redirect('/listings');
      });
};