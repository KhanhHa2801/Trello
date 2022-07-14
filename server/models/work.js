const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')
const Schema = mongoose.Schema;

const workSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, schemaOptions)

module.exports = mongoose.model('Work', workSchema)