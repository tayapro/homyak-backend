express = require("express")
morgan = require("morgan")
mongoose = require("mongoose")
require('dotenv').config()
Note = require("./models/note")
const app = express()
const port = 3000

//in order to parse POST JSON
app.use(express.json())
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
