require('dotenv').config();
const bodyParser = require('body-parser');

const express = require('express');
const port = 4001;
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    userModel.findById(id, function(err, user) {
      done(err, user);
    });
  });
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:4001/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
    userModel.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
// Route to Homepage
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/auth/google',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));
app.get( '/auth/google/secrets',
    passport.authenticate( 'google', {
        successRedirect: '/secrets',
        failureRedirect: '/login'
}));

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