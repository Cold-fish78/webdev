require('dotenv').config();
const bodyParser = require('body-parser');

const express = require('express');
const port = 4001;
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser())
app.set('views', path.join(__dirname, 'views'));
app.use(session({
    secret: "our little secret.",
    resave: false,
    saveUninitialized: false
}))
const userModel = require('./model/user');
app.use(passport.initialize());
app.use(passport.session());


passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

// Route to Homepage
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/register', (req, res) => {
    res.render('register');
});
app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});
app.post('/create-user', (req, res) => {
    userModel.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(req.body.username);
            console.log(req.body.password);
            console.log("and error occurred while authenticating" + err);
            res.redirect('/register')
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect('/secrets');
            })
        }
    });
})
app.post('/user-login', (req, res) => {
    const user = new userModel({
        username: req.body.username,
        password: req.body.password
    });
   
    req.login(user, function (err) {
        if (err) {
            console.log("an error occurred while logging in " + err);
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secrets");
            })
        }
    })

}),
app.get('/logout',function(req,res){
    req.logout();
    res.redirect("/"); 
})
    app.listen(port, function (err) {
        if (err) {
            console.log("an error occurred !!" + err);
        }
        else {
            console.log("app is running at port" + port);
        }

    });