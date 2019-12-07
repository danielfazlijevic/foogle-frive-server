const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs')

const router = express.Router();


const User = require('../database/models').User;

// import passport and passport-jwt modules
const passport = require('passport');
require('../config.js')(passport);
const passportJWT = require('passport-jwt'); // ExtractJwt to help extract the token
const jwt = require('jsonwebtoken');



router.use(passport.initialize());

// Home page route.
router.get('/', function (req, res) {
    res.send('Auth v1');
});

router.get('/current', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    res.json(req.user);
});


router.post('/login', async (req, res) => {

    const {
        username,
        password
    } = req.body;

    console.log(username, password);

    // if the username / password is missing, we use status code 400
    // indicating a bad request was made and send back a message
    if (!username || !password) {
        return res.status(400).send(
            'Request missing username or password param'
        );
    }

    try {
        const user = await User.findOne({
            where: {
                username
            }
        });

        if (!user) {
            return res.status(400).send('invalid username or password');
        }
        console.log(password, user.password);

        const validPassword = user.validPassword(password);

        if (!validPassword) {
            res.status(400).send('Invalid password');
        }

        var token = jwt.sign(user.toJSON(), 'jwtsecretkey', {
            expiresIn: 604800 // 1 week
        });
        // return the information including token as JSON
        res.json({
            success: true,
            token: 'Bearer ' + token
        });

    } catch (err) {
        console.log(err);
        return res.status(400).send('invalid username or password');
    }

});


router.post('/signup', async (req, res) => {
    // hash the password provided by the user with bcrypt so that
    // we are never storing plain text passwords. This is crucial
    // for keeping your db clean of sensitive data
    const hash = bcrypt.hashSync(req.body.password, 10);

    try {
        // create a new user with the password hash from bcrypt
        let user = await User.create(
            Object.assign(req.body, {
                password: hash
            })
        );

        const token = jwt.sign(user.toJSON(), 'jwtsecretkey', {
            expiresIn: 604800 // 1 week
        });


        // return the information including token as JSON
        res.json({
            success: true,
            token: 'Bearer ' + token
        });


    } catch (err) {
        console.log(err);
        return res.status(400).send('Error while creating a new user!');
    }

});
module.exports = router;