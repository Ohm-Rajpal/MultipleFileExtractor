// imports
import express from "express"
import bodyParser from "body-parser"
import {dirname} from "path"
import path from "path"
import {fileURLToPath} from "url"
import multer from "multer"
import AdmZip from "adm-zip"
import fs from "fs"

const app = express()
const port = 8000
const __dirname = dirname(fileURLToPath(import.meta.url)) // get the os dir

app.use(bodyParser.urlencoded({ extended: true }));

// server the initial html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './extracts')
    },
    filename: function (req, file, cb) { // naming functionality
        console.log(file.originalname)
        cb(null, file.originalname)
    }
})

// create upload multer object
const upload = multer({ storage: storage })

// custom function to delete all the files in the extracts folder
function deleteZip(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
        const filePath = directory + "/" + file
        if (fs.statSync(filePath).isFile() && path.extname(filePath).toLowerCase() === '.zip') {
            fs.unlinkSync(filePath)
            console.log(`Deleted ${filePath}`)
        }
    });
}

// post request
app.post('/extract', upload.array('files[]'), (req, res) => {
    // multer puts files in req.files
    const fileArr = req.files
    const endPath = req.body.extractPath

    if (!fileArr || fileArr.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // iterate over every file, unzip, place in chosen directory
    fileArr.forEach(
        (currentFile) => {
            // get the zip file
            const zipFile = new AdmZip(currentFile.path)
            // extract
            zipFile.extractAllTo(endPath)
        }
    );
    // delete zip files
    deleteZip(__dirname + '/extracts')
    res.send('Successful file extraction!')
});

// listen to the port
app.listen(port, () => {
    console.log(`Multiple file extractor listening on port ${port}`)
})