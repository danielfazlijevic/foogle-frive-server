const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs')

const multer = require('multer');

const router = express.Router();


const User = require('../database/models').User;

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
    res.send('Files API');
});

router.get('/list/:path?', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    const nested = req.params.path ? '/' + req.params.path : '';
    const files = await listFolderContent(req.user.username + nested);
    console.log('Files: ', files);
    res.json(files);
})

router.post('/mkdir/:dirname/:customPath?', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    console.log('path je', req.params.customPath);
    const folderPath = req.params.path || '/';
    console.log(folderPath);
    const folderCreated = await createFolder(req.user.username + folderPath + req.params.dirname);
    console.log('folder created', folderCreated);
    if (folderCreated) {
        res.json({
            "message": "Folder created successfully"
        });
    } else {
        res.status(400).send('Error!');
    }
})


router.get('/get/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // TODO - dodati validaciju
    try {

        const requestedFilePath = req.body.requestedFilePath;
        const file = await getFileFromPath(requestedFilePath)
        console.log('requested file at', requestedFilePath);
        res.send(file);
    } catch (e) {
        res.status(400).send('Error!');
    }
});

router.post('/upload', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // TODO - dodati validaciju

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const filePath = './user_data/' + req.user.username + (req.body.filePath || '');
            console.log('filePath: ', filePath);
            cb(null, filePath);
        },
        filename: function (req, file, cb) {
            cb(null, file.originalname)
        }
    });

    const upload = multer({
        storage: storage
    }).any();

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(400).end("Error uploading file.");
        } else {
            console.log('body?', req.body.filePath);
            // req.files.forEach(function (f) {
            //     // and move file to final destination...
            // });
            res.end("File has been uploaded");
        }
    });

});



module.exports = router;