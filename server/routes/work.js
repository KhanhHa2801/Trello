const router = require('express').Router()
const { default: mongoose } = require('mongoose')
const { Work } = require('../models/index')

router.get('/', async (req, res) => {
    // res.send('hi')
    try {
        const works = await Work.find()
        // console.log(works)
        // res.send(works)
        res.status(200).json(works)
    }catch (err) {
        res.status(404).json('Error when fetch data')
        console.log(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const work = await new Work({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name
        })
        await work.save()
        res.status(200).json(work)
    }catch (err){
        res.status(404).json('Error when post data')
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const work = await Work.findById({_id: req.params.id})
        res.status(200).json(work)
    }catch(err) {
        res.status(404).json('Error when fetch an data')
        console.log(err)
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const work = await Work.findByIdAndRemove({_id: req.params.id})
        res.status(200).json(work)
    }catch(err) {
        res.status(404).json('Error when delete an data')
        console.log(err)
    }
})

module.exports = router