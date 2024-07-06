// imports
import express from "express"
import bodyParser from "body-parser";
import {dirname} from "path";
import {fileURLToPath} from "url";

const app = express()
const port = 3000
const __dirname = dirname(fileURLToPath(import.meta.url)) // get the os dir

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
