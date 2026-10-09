import multer from 'multer'

const storage=multer.memoryStorage();


// single file upload

export const singleUpload=multer({storage}).single('file')

// mutiple uplaod upto 5 images
export const multipleUpload=multer({storage}).array("files",5)