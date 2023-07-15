const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();

app.use(cors());
app.use(bodyParser.json())


const upload = require('./uploadMiddleware')
const Resize = require('./Resize')


app.get('/me/photo/:name', function (req, res) {
    var filename = req.params.name;
    const imagePath = path.join(__dirname, '/avatars/'+filename);
    res.sendFile(imagePath, function (err) {
        if (err) {
            res.status(err.status).end('.');
        }
    })
})

app.get('/me/photo/passport/:name', function (req, res) {
    var filename = req.params.name;
    const imagePath = path.join(__dirname, '/passports/'+filename);
    res.sendFile(imagePath, function (err) {
        if (err) {
            res.status(err.status).end('.');
        }
    })
})

app.post('/avatar', upload.single('image'), async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/avatars');
    // call class Resize
    let nick = req.body.nick;
    const fileUpload = new Resize(imagePath);


    if (!req.file) {
        res.status(401).json({success: 0, error: 'Please provide an image'})
        return
    }

    await fileUpload.save(req.file.buffer, nick)
    
    return res.status(200).json({ success: 1, error: 'Upload success' })
})

app.post('/passport/front', upload.single('image'), async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/passports');
    // call class Resize
    let nick = req.body.nick;
    const fileUpload = new Resize(imagePath);

    if (!req.file) {
        res.status(401).json({success: 0, error: 'Please provide an image'})
        return
    }

    await fileUpload.savePassPortFront(req.file.buffer, nick)
    
    return res.status(200).json({ success: 1, error: 'Upload success' })
})

app.post('/passport/back', upload.single('image'), async function (req, res) {
    // folder upload
    const imagePath = path.join(__dirname, '/passports');
    // call class Resize
    let nick = req.body.nick;
    const fileUpload = new Resize(imagePath);

    if (!req.file) {
        res.status(401).json({success: 0, error: 'Please provide an image'})
        return
    }

    await fileUpload.savePassPortBack(req.file.buffer, nick)
    
    return res.status(200).json({ success: 1, error: 'Upload success' })
})

module.exports = app;