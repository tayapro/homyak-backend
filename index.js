express = require('express')
axios = require('axios')
morgan = require('morgan')
mongoose = require('mongoose')
jwt = require('jsonwebtoken')
jwkToPem = require('jwk-to-pem')
require('dotenv').config()
cors = require('cors')
Note = require('./models/note')

const app = express()
const port = 3000

//in order to parse POST JSON
app.use(express.json())
app.use(
    cors({
        origin: process.env.CORS_ALLOWED_ORIGINS
            ? process.env.CORS_ALLOWED_ORIGINS.split(' ')
            : '*',
        credentials: true,
    })
)
app.use(morgan('combined'))

mongoose.connect(process.env.MONGO_URL).catch(function (err) {
    console.log(err)
})

app.listen(port, function () {
    console.log(`...Server started on port ${port}...`)
})

let myidKeys = null
axios.get(process.env.MYID_URL).then((resp) => {
    myidKeys = resp.data
    //console.log(myidKeys)
})

//let k = await axios.get(process.env.MYID_URL)
// async function getKeys(kid) {
//     if (!myidKeys || tttttttttt) {
//         myidKeys = await axios.get(process.env.MYID_URL)
//         t5tttttt
//     }

//     return myidKeys
// }

app.get('/ping', async function (req, res) {
    res.status(200).send()
})

// Create note
app.post('/notes', async function (req, res) {
    try {
        const decoded_token = verifyToken(req.headers)
        if (!decoded_token) return res.status(401).send()

        const username = decoded_token.username

        const note = new Note({
            author: username,
            createdAt: Date.now(),
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
        })
        const id = (await note.save()).id
        res.status(200).send(id)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Read note
app.get('/notes/:id', async function (req, res) {
    try {
        const decoded_token = verifyToken(req.headers)
        if (!decoded_token) return res.status(401).send()

        const username = decoded_token.username

        const note = await Note.findById(req.params.id)
        console.log(req.params.id)
        const result = noteDto(note)
        if (result.author !== username) {
            return res.status(403).send()
        }

        res.json(result)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Delete note
app.delete('/notes/:id', async function (req, res) {
    try {
        const decoded_token = verifyToken(req.headers)
        if (!decoded_token) return res.status(401).send()

        const username = decoded_token.username
        const note = await Note.findById(req.params.id)

        if (note.author !== username) {
            return res.status(403).send()
        }
        await Note.deleteOne({ _id: req.params.id })
        res.status(200).send()
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Update note
app.put('/notes/:id', async function (req, res) {
    try {
        const decoded_token = verifyToken(req.headers)
        if (!decoded_token) return res.status(401).send()

        const username = decoded_token.username
        const note = await Note.findById(req.params.id)

        if (note.author !== username) {
            return res.status(403).send()
        }
        req.body.author = username
        await Note.findByIdAndUpdate({ _id: req.params.id }, req.body)
        res.status(200).send()
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// List notes
app.get('/notes', async function (req, res) {
    try {
        const decoded_token = verifyToken(req.headers)
        if (!decoded_token) return res.status(401).send()

        const username = decoded_token.username

        const all_notes = await Note.find({ author: username })

        const result = all_notes.map((n) => noteDto(n))
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

function verifyToken(headers) {
    try {
        const auth = headers['authorization']
        if (!auth) {
            throw new Error('No auth header')
        }
        const token = auth.split(' ')[1]
        console.log(token)
        console.log('>>>>>', myidKeys)
        const { header } = jwt.decode(token, { complete: true })
        console.log('key ID >>>>>', header.kid)
        //const key = await getKeys(header.kid)
        // if (!key) {
        //     throw new Error('Key not found')
        // }
        //const decoded_token = jwt.decode(token)
        //const decoded_token = jwt.verify(token, jwkToPem(jwks.keys[0]), {
        const decoded_token = jwt.verify(token, jwkToPem(myidKeys.keys[0]), {
            algirithms: ['RS256'],
        })
        console.log(decoded_token)
        return decoded_token
    } catch (e) {
        console.error('ERROR :::', e)
        return undefined
    }
}

function noteDto(note) {
    return {
        id: note.id,
        author: note.author,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        title: note.title,
        text: note.text,
        tags: note.tags,
    }
}
