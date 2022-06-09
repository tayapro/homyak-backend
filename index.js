express = require("express")
morgan = require("morgan")
mongoose = require("mongoose")
jwt = require("jsonwebtoken")
jwkToPem = require("jwk-to-pem") 
require('dotenv').config()
cors = require("cors")
Note = require("./models/note")
const app = express()
const port = 3000
const jwks = JSON.parse(`{"keys":[{"e":"AQAB","kid":"XooolbD0BPGABjHzSDRfQ4YBg8H87zwTJVmmP8I81OA","kty":"RSA","n":"tRXzVqY51HMCh-iK2K0YmGF044P2qM_42MDBZuk6CpqUg1Vm7ylBHLm41QWNIwvzyVtBiibjSPtT_Ua2-_6v5dz2bwZqUzxYU_yq5sacv3yfOpwe8mYej2wyaC0fBcKSigrpFj3nDHTXEUGIiR0Vptd7ja7vjOcj_8raGjaR7zGF_5P42OA-UUDmRmyU1PG_d4fV-bagip1byEcPM4GSxqOnWkJdNX9da82S9QxYSofFq9t8MYH2texM5ImcqZ0FmdUXb8k1DeBXv0dqg1ZbhaDvCzNWfgoMjhPeB5lpnCP0gR-X_3dLJDPI1lU0ddnjepCWuh48WuImxfilaoQCcw","alg":"RS256","use":"sig"}]}`)
console.log(jwks)

//in order to parse POST JSON
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

mongoose.connect(process.env.MONGO_URL).catch(function (err){
    console.log(err)
})

app.listen(port, function() {
    console.log(`...Server started on port ${port}...`)
})

app.get("/ping", async function(req, res){
    res.status(200).send()
})

// Create note
app.post("/notes", async function(req, res){ 
    try {
        const note = new Note({
            author: req.body.author,
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
app.get("/notes/:id", async function(req, res){
    try {
        const note = await Note.findById(req.params.id)
        const result = {
            id: note.id,
            author: note.author,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
            title: note.title,
            text: note.text,
            tags: note.tags,            
        }
        res.json(result)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Delete note
app.delete("/notes/:id", async function(req, res){
    try {
        await Note.deleteOne({_id: req.params.id})
        res.status(200).send()
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// Update note
app.put("/notes/:id", async function(req, res){
    try {
        await Note.findByIdAndUpdate({_id: req.params.id}, req.body)
        res.status(200).send()
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

// List notes
app.get("/notes", async function(req, res){
    try {
        if(!verifyToken(req.headers))
            return res.status(401).send()
        const all_notes = await Note.find()
        const result = all_notes.map(n => {
            return {
                id: n.id,
                author: n.author,
                createdAt: n.createdAt,
                updatedAt: n.updatedAt,
                title: n.title,
                text: n.text,
                tags: n.tags,
            } 
        })
        res.status(200).json(result)
    } catch (e) {
        console.error(e)
        res.status(400).send()
    }
})

function verifyToken(headers){
    try{
        const auth = headers["authorization"]
        if(auth === undefined){
            throw new Error("No auth header")
        }
        const token = auth.split(" ")[1]
        console.log(token)
        //const decoded_token = jwt.decode(token)
        const decoded_token = jwt.verify(token, jwkToPem(jwks.keys[0]), { algirithms: ['RS256'] })
        console.log(decoded_token)
        return true
    } catch(e) {
        console.error("ERROR :::", e)
        return false
    }
}