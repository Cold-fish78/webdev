require('dotenv').config();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const bodyParser = require('body-parser');
// const md5 = require('md5');
const express = require('express');
const UserModel = require('./model/user');
const app = express();
const port = 4007;
console.log(process.env.API_KEY);
const path = require('path');
const cookieParser = require('cookie-parser');
const userModel = require('./model/user');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(cookieParser())
app.set('views', path.join(__dirname, 'views'));


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
app.post('/create-user', (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const SaveUser = new UserModel({
            email:req.body.email,
            password:hash
        })
        SaveUser.save((error, savedUser) => {
    
            if (err) {
                console.log(err);
            }
            else {
                res.render('secrets');
            }
        }
        )
    });
    
    res.render('secrets');
},
    app.post('/user-login', (req, res) => {
        const username1 = req.body.usernameLogin;
        const password1 =req.body.passwordLogin;
        userModel.findOne({ email:username1 }, function (err, foundUser) {
            if (err) {
                console.log("an error occurred !" + err);
            }
            else {
                if (foundUser) {
                    bcrypt.compare(password1, foundUser.password, function(err, result) {
                        // result == true
                        if(result === true){
                            res.render('secrets');

                        }
                    });
                        return;
                    
                }

            }

        })
    }));
app.listen(port, function (err) {
    if (err) {
        console.log("error occurred !! " + err);

    }
    else {
        console.log("app running at port number ..." + port);
    }

})