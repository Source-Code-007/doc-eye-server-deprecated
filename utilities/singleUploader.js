const multer = require("multer");
const path = require('path');

function singleUploader(fileUploadDest, allowed_file_types, err_msg) {
    // ---- prepare the final multer upload object ----

    // define storage 
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fileUploadDest)
        },
        filename: (req, file, cb) => {
            const fileExt = path.extname(file.originalname)
            const modifiedName = `${file.originalname.replace(fileExt, '').toLowerCase().split(' ').join('-')}-${Date.now()}${fileExt}`
            console.log(modifiedName);
            cb(null, modifiedName)
        }
    })
    // file upload config and operation
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1000000 // 1MB - By bytes
        },
        fileFilter: (req, file, callback) => {
            console.log(file);
            console.log(allowed_file_types, 'array');
            if(allowed_file_types.includes(file.mimetype)){
                callback(null, true) // first param - error null, second param - permit true
            } else{
                callback(new Error(err_msg))
            }
            // else if (file.fieldname === 'doctor-documents') {
            //     if (file.mimetype === 'application/pdf') {
            //         callback(null, true) // first param - error null, second param - permit true
            //     } else {
            //         callback(new Error('Only .pdf format allowed!'))
            //     }
            // } else {
            //     callback(new Error('File upload err!!!'))
            // }
        }

    })

    return upload
}

module.exports = singleUploader