// imports
import express from "express"
import bodyParser from "body-parser"
import {dirname} from "path"
import {fileURLToPath} from "url"
import multer from "multer"
import AdmZip from "adm-zip"

const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url)) // get the os dir

app.use(bodyParser.urlencoded({ extended: true }));

// server the initial html file
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

// multer middleware
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './extracts')
    },
    filename: function (req, file, cb) { // naming functionality
        console.log(file.originalname)
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

// post request
app.post('/extract', upload.array('files[]'), (req, res) => {
    // // multer puts files in req.files
    const fileArr = req.files
    const endPath = req.body.extractPath

    if (!fileArr || fileArr.length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    console.log(`File array type looks like this: ${typeof fileArr}`)
    console.log(`This is the user end path: ${endPath}`)

    // iterate over every file, unzip, place in chosen directory
    fileArr.forEach(
        (currentFile) => {
            // get the zip file
            const zipFile = new AdmZip(currentFile.path)
            // extract
            zipFile.extractAllTo(endPath)
        }
    );
    fileArr.forEach(currentFile => {
        const zipFile = new AdmZip(currentFile.path);
        zipFile.extractAllTo(endPath);
    });

    res.send('Successful file extraction!')
});

// listen to the port
app.listen(port, () => {
    console.log(`Multiple file extractor listening on port ${port}`)
})