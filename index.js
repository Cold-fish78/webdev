require('dotenv').config();
const bodyParser = require('body-parser');

const express = require('express');
const UserModel = require('./model/user');
const app = express();
const port = 4009;
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
    const SaveUser = new UserModel(req.body)
    SaveUser.save((error, savedUser) => {
        // if (error) throw error
        // res.json(savedUser)
        // // res.render('secrets')
        if (err) {
            console.log(err);
        }
        else {
            res.render('secrets');
        }
    }
    )
    res.render('secrets');
},
    app.post('/user-login', (req, res) => {
        const username = req.body.usernameLogin;
        const password = req.body.passwordLogin;
        userModel.findOne({ email: req.body.usernameLogin }, function (err, foundUser) {
            if (err) {
                console.log("an error occurred !" + err);
            }
            else {
                if (foundUser) {
                    console.log(req.body.passwordLogin);

                    if (foundUser.password === req.body.passwordLogin) {
                        res.render('secrets');
                        return;
                    } else {
                        console.log("user found but password did not match")
                    }
                }

            }

        })
    }));
app.listen(port, function (err) {
    if (err) {
        console.log("error occurred !! " + err);

    }
    else {
        console.log("app running at port number" + port);
    }


})