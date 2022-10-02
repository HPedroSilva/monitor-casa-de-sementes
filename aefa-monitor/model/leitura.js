const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    temperatura: {
        required: true,
        type: Number
    },
    umidade: {
        required: true,
        type: Number
    },
    data: {
        required: true,
        type: Date
    },
    cloudSaved: {
        required: true,
        type: Boolean
    }
})

module.exports = mongoose.model('leitura', dataSchema)