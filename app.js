const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews');
const usersRoute = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratagy = require('passport-local');
const User = require('./models/user');
//const Joi = require('joi');
//const morgan = require('morgan'); //used for logs

//connect to mongoose:
mongoose.connect('mongodb://localhost:27017/yelpcamp')
    .then(() => {
        console.log("connected to mongoDB.");
    })
    .catch(err => {
        console.log('Error in mongoDB connection');
        console.log(err);
    })

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// morgan is middleware to log info of incomming requests:
// app.use(morgan('tiny'));

const sessionConfig = {
    secret: 'changeinproduction',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratagy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');;
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeuser', async (req, res) => {
    const user = new User({email: 'savan@gmail.com', username: 'sp'});
    const newUser = await User.register(user, 'asdf');
    res.send(newUser);
});

app.use('/', usersRoute);
app.use('/campgrounds', campgroundsRoute);
app.use('/campgrounds/:id/reviews', reviewsRoute);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) message = 'Oh No, Something Went Wrong!!!';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log("Serving on port 3000...");
});