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
    getFileFromPath,
    renameFile,
    deleteFolder,
    testRename,
    moveFile
} = require('../utils/fileManagement');

router.use(passport.initialize());

// Home page route.
router.get('/', function (req, res) {
    res.send('Files API');
});

router.get('/list/root', passport.authenticate('jwt', {
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


router.get('/list/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    console.log('getting files')
    try {
        const nested = req.query.path || '';
        const fullPath = nested;
        const files = await listFolderContent(fullPath);
        console.log('Files: ', files);
        res.json({
            files,
            path: fullPath
        });
    } catch (err) {
        console.log(err);
        res.status(400).send('Error!');
    }
})


router.post('/mkdir/:dirname/', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    console.log('path je', req.params.customPath);
    const folderPath = req.body.customPath || '/';
    console.log(folderPath);
    const folderCreated = await createFolder(folderPath + req.params.dirname);
    console.log('folder created', folderCreated);
    if (folderCreated) {
        res.json({
            "message": "Folder created successfully"
        });
    } else {
        res.status(400).send('Error!');
    }
})


router.post('/get/', passport.authenticate('jwt', {
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






router.patch('/rename', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const {
            currentPath,
            wantedName
        } = req.body;
        const renamed = await renameFile(currentPath, wantedName)
        res.send("OK!");
    } catch (err) {
        console.log('error', err);
        res.status(400).send('Error!');
    }
});

router.patch('/move', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        const {
            currentPath,
            desiredPath
        } = req.body;
        const renamed = await moveFile(currentPath, desiredPath)
        res.send("OK!");
    } catch (err) {
        console.log('error', err);
        res.status(400).send('Error!');
    }
});


router.get('/test-rename', async (req,res,next) => {
    testRename();
    res.send('ok');

});

router.delete('/folder', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    try {
        console.log(req.body);
        const {
            folderPath
        } = req.body;
        console.log(folderPath);
        await deleteFolder(folderPath)
        res.send("OK!");
    } catch (err) {
        console.log('error', err);
        res.status(400).send('Error!');
    }
});

router.put('/upload', passport.authenticate('jwt', {
    session: false
}), async (req, res) => {
    // TODO - dodati validaciju

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            console.log('file path from req:', req.body);
            const filePath = './user_data/' + (req.body.filePath || '');
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