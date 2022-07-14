const mongoose = require('mongoose')
const { schemaOptions } = require('./modelOptions')
const Schema = mongoose.Schema;

const listTempSchema = new mongoose.Schema({
    lists: {
        type: [ mongoose.Schema.Types.ObjectId ],
        ref: 'ListWork',
        default: []
    }
}, schemaOptions)

module.exports = mongoose.model('ListTemp', listTempSchema)