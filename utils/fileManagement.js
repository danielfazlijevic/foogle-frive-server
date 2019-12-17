const fs = require('fs');
const path = require('path');


const createFolder = (folderPath) => {
    // return new Promise((resolve, reject) => {
    //     console.log('Trying to make a folder', folderPath);
    //     fs.mkdirSync(process.cwd() + '/user_data/' + folderPath, {
    //         recursive: true
    //     }, error => {
    //         error ? reject(error) : resolve();
    //     });
    // });
    console.log('attempting to create a folder at path', folderPath);
    if (fs.existsSync(process.cwd() + '/user_data/' + folderPath)) {
        return true;
    } else {
        fs.mkdirSync(process.cwd() + '/user_data/' + folderPath);
        return true;
    }
};

const listFolderContent = (folder) => {
    return new Promise((resolve, reject) => {
        const folderPath = 'user_data/' + folder;
        console.log('folder path', folderPath);
        fs.readdir(folderPath, (error, files) => {
            error ? reject(error) : resolve(files);
        });
    });
}

const getFileFromPath = (fileLocation) => {
    return new Promise((resolve, reject) => {
        fs.readFile('user_data/' + fileLocation, function (error, data) {
            if (error)
                return reject(error);
            const ext = path.extname(fileLocation).substr(1);
            const content = ext !== 'txt' ? data.toString('base64') : data.toString();
            // console.log('encoding: ', encoding);
            resolve(content);
        });
    });
}

module.exports = {
    createFolder,
    listFolderContent,
    getFileFromPath
}