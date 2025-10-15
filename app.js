const express =  require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const wrapAsync = require('./utils/wrapasync'); 

const ExpressError = require('./utils/ExpressError');

const {listingSchema} = require('./schema.js');
const { reviewSchema } = require('./schema');
const Review = require('./models/review');

const listings = require('./routes/listing');
const reviews = require('./routes/review');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const MongoStore = require('connect-mongo');

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

app.use(cookieParser('thisisasecret'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const mongoose = require('mongoose');
const Listing = require('./models/listing');
const dburl = process.env.ATLAS_URI;


main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

async function main() {
    await mongoose.connect(dburl);
}

const store = MongoStore.create({
    mongoUrl: dburl,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600 // time period in seconds
});

store.on("error", function(e){
    console.log("Session store error", e);
});

const sessionOptions = {
    store: store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true // Uncomment this line when using HTTPS
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

app.get('/getcookies', (req, res) => {
   res.cookie('Name', 'JohnDoe');
   res.cookie('Age', '30');
   res.send('Cookies have been set');
});

app.get('/verify', (req, res) => {
    console.log('req.signedCookies:', req.signedCookies);
    res.send('Cookies have been verified');
});

app.get('/signedcookies', (req, res) => {
    res.cookie('color', 'blue', { signed: true });
    res.send('Signed cookie has been set');
});

app.get('/', (req, res) => {
    let { Name = 'Guest' } = req.cookies;
    res.send(`Hi, ${Name}! Welcome to Wanderlust!`);
});

//Index route to display all listings
// app.get('/thug', (req, res) => {
//     a = a;
// });

// app.use((err, req, res, next) => {
//     console.log('Error encountered:', err);
//     throw new ExpressError('Something went wrong!', 401);
// });

// app.use((err, req, res, next) => {
//     const { statusCode, message } = err;
//     res.status(statusCode).send(message);
// });

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);
app.use('/', userRoutes);


app.get('/demouser', async (req, res) => {
    let fakeUser = new User({ username: 'DemoUser', email: 'demouser@example.com' });
  let registeredUser = await User.register(fakeUser, 'demopassword');
  res.send(registeredUser);
});

app.use((req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    let { message = 'Something went wrong!', statusCode = 500 } = err;
    res.status(statusCode).render('error', { err });
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});