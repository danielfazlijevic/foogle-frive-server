const express = require('express');
const fs = require('fs')


const router = express.Router();


const User = require('../database/models').User;
const Link = require('../database/models').Link;

// import passport and passport-jwt modules
const passport = require('passport');
require('../config.js')(passport);
const passportJWT = require('passport-jwt'); // ExtractJwt to help extract the token
const jwt = require('jsonwebtoken');

const {
    createFolder,
    listFolderContent,
    getFileFromPath
} = require('../utils/fileManagement');

router.use(passport.initialize());

// Home page route.
router.get('/', function (req, res) {
    res.send('Shared Files API');
});


router.put('/create/:username?', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    console.log(`making a shared link to ${req.user.username}'s folder`);
    try {

        const sharedFolder = req.user.username;
        const createdLink = await Link.create({
            folder: sharedFolder,
            ownerId: req.user.id,
            type: req.params.username ? 'user' : 'guest'
        }, {
            include: [{
                model: User,
                as: "User"
            }]
        })
        createdLink.setUser(req.user);
        console.log(createdLink);
        if (req.params.username) {
            const user = await User.findOne({
                where: {
                    username: req.params.username
                }
            });
            if (!user) res.send(404);
            user.addAccessTo(createdLink);
            console.log('user', user);
            // createdLink.addSharedTo(req.params.username);
        }

        res.send(createdLink);
    } catch (err) {
        console.error('ERROR', err);
    }
});



router.get('/link-info/:link', async (req, res) => {
    try {
        console.log('link: ', req.params.link);
        const link = await Link.findByPk(req.params.link);
        console.log('link found:', link);
        res.send(link);
    } catch (err) {
        res.send(err);
    }
})


router.get('/files/list/root', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const nested = req.params.path ? '/' + req.params.path : '';
    const fullPath = req.user.username + nested;
    const files = await listFolderContent(fullPath);
    console.log('Files: ', files);
    res.json({
        files,
        path: fullPath
    });
})


router.get('/list/:link', async (req, res) => {
    console.log('getting files')
    try {
        const link = await Link.findByPk(req.params.link);
        // console.log(link, req.query.path);
        console.log('path', req.query.path);
        const nested = req.query.path ? '/' + req.query.path.substring(req.query.path.indexOf('/')) : link.folder;
        console.log('nested', nested);
        console.log('requesting folder', nested);
        // res.send(link);
        const files = await listFolderContent(nested);
        // console.log('Files: ', files);
        res.json({
            files,
            path: nested
        });
    } catch (err) {
        console.log(err);
        res.status(400).send('Error!');
    }
})


router.post('/files/get/', async (req, res) => {
    // TODO - dodati validaciju
    try {
        const requestedFilePath = req.body.requestedFilePath;
        console.log('requested file at', requestedFilePath);
        const file = await getFileFromPath(requestedFilePath)
        res.send(file);
    } catch (e) {
        res.status(400).send('Error!');
    }
});

router.get('/folders', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    console.log('listing folder access');
    console.log('user', req.user);
    const folders = await req.user.getAccessTo();
    res.json(folders);
});



module.exports = router;