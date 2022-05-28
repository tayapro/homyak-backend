mongoose = require("mongoose")

const schema = new mongoose.Schema({
    author: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        required: true,
    },
    updatedAt: {
        type: Number,
        required: true,
        default: () => Date.now()
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    tags: {
        type: Array,
    }
})

const Note = mongoose.model("notes", schema)

module.exports = Note