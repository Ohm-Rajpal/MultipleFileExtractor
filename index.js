// imports
import express from "express"
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";
import multer from "multer"

const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url)) // get the os dir

// for multer applications, diskstorage is required
// credit: https://medium.com/@ali.r.riahi/nodejs-upload-best-practice-976062a267ba
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10000000 // 10 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['application/zip'];

        if (!allowedTypes.includes(file.mimetype)) {
            const error = new Error('Invalid file type');
            error.code = 'INVALID_FILE_TYPE';
            return cb(error, false);
        }

        cb(null, true);
    }
});

module.exports = upload;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// create middleware
function processMultipleFiles(req, res, next) {
    // file processing here
    console.log(req.body)
    next()
}

// run the custom middleware
app.use(processMultipleFiles)

// post request to handle the button click
app.post('/extract', (req, res) => {
    // res.sendFile() // send html file that shows a completion screen
})

// listen to the port
app.listen(port, () => {
    console.log(`Multiple file extractor listening on port ${port}`)
})
