const fs = require('fs-extra');
const path = require('path');


const createFolder = (folderPath) => {
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

const renameFile = (currentPath, wantedName) => {
    return new Promise((resolve, reject) => {
        try {
            const folderPath = 'user_data/' + currentPath;
            const newPath = folderPath.substring(0, folderPath.lastIndexOf('/') + 1) + wantedName;

            console.log('attempting to rename ', currentPath, "to", newPath);
            fs.rename(folderPath, newPath, function (error) {
                error ? reject(error) : resolve();
            });
        } catch (err) {
            reject(error);
        }
    });
}

const testRename = () => {
    console.log('test rename');
    try {
        fs.renameSync('user_data/daniel/novifolder221', 'user_data/daniel/renamed')
    } catch (err) {
        console.error(err)
    }
}





const deleteFolder = (folderPath) => {
    console.log('trying to delete', folderPath);
    return new Promise((resolve, reject) => {
        fs.rmdir('user_data/' + folderPath, function (error) {
            error ? reject(error) : resolve(true);
        })
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

const moveFile = (currentLocation, desiredLocation) => {
    console.log('moving', currentLocation, ' to', desiredLocation)
    return new Promise((resolve, reject) => {
        fs.move('user_data/' + currentLocation, 'user_data/' + desiredLocation, err => {
            if (err) reject(err)
            resolve(true);
        })
    });

}

// const removeFileAtPath = (fileLocation) => {
//     return new Promise((resolve, reject) => {
//         try {
//             await fs.remove('user_data/' + fileLocation);
//             resolve();
//         } catch (err) {
//             console.error(err);
//             reject(err);
//         }
//     });
// }

module.exports = {
    createFolder,
    listFolderContent,
    getFileFromPath,
    renameFile,
    deleteFolder,
    testRename,
    moveFile
    // removeFileAtPath
}