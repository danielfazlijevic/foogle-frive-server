# File management method

_file: file or folder_

## Saving/Uploading


- File content is saved on File system
- File data is saved in the database

This method allows for easier queries but also enables the ease-of-use of the file system. 

## Downloading

- User only gets the list of files
- User can download files
- User can preview files online


## Models 

### File

ID | INT | PK  
NAME  | STRING  
PARENT | INT | FK references File  
OWNER | INT | FK references USER  
TYPE  | ENUM[file, folder]

File location: `OWNER/PARENT/ID`


### Share Permission
ID | INT | PK  
CREATED BY | INT | FK references USER  
USER | INT | FK references USER
SHARED FOLDER | INT | FK references FILE

### Share Link

ID | INT | PK  
OWNER | INT | FK references USER
FOLDER ID | INT | FK REFERENCES FILE






