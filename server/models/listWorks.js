const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')
const Schema = mongoose.Schema;

const listWorksSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    works: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'Work',
        default: []
    }
}, schemaOptions)

module.exports = mongoose.model('ListWork', listWorksSchema)