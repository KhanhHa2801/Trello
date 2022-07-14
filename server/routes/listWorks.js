const router = require('express').Router()
const { default: mongoose } = require('mongoose')
const { ListWorks, ListTemp } = require('../models/index')
const { findByIdAndUpdate } = require('../models/work')

router.get('/', async (req, res) => {
    try {
        const listTemp = await(await ListTemp.findById({_id: '62b26cc946728371e8255520'}).populate([{
            path: 'lists',
            model: 'ListWork',
            populate: {
                path: 'works',
                model: 'Work'
            }
        }]))
        const currListWorks = listTemp.lists
        // const listWorks = await ListWorks.find().populate('works')
        // console.log(currListWorks)
        res.status(200).json(currListWorks)
    }catch(err) {
        res.status(404).json('Error when fetch data')
        console.log(err)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const listWork = await ListWorks.findById({_id: req.params.id}).populate('works')
        res.status(200).json(listWork)
    }catch(err) {
        res.status(404).json('Error when fetch data')
        console.log(err)
    }
})

router.post('/', async (req, res) => {
    try {
        const list = new ListWorks({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name,
            works: req.body.works
        })
        await list.save()
        const listAll = await ListWorks.find()
        let arrIdList = []
        listAll.map(list => {
            arrIdList.push(list._id)
        })
        const listItem = await ListTemp.findByIdAndUpdate({_id: '62b26cc946728371e8255520'}, {lists: arrIdList}).populate([{
            path: 'lists',
            model: 'ListWork',
            populate: {
                path: 'works',
                model: 'Work'
            }
        }])
        res.status(200).json(listItem)
    }catch(err) {
        res.status(404).json('Error when post data')
        console.log(err)
    }
})

router.post('/:id', async (req, res) => {
    try {
        const currListWorks = await ListWorks.findById({_id: req.params.id})
        const currWorks = currListWorks.works
        currWorks.push(new mongoose.Types.ObjectId(req.body.work))

        await ListWorks.findByIdAndUpdate({_id: req.params.id}, {works: currWorks})
        const listWorks = await ListWorks.findById({_id: req.params.id}).populate('works')
        res.status(200).json(listWorks)
    }catch(err) {
        res.status(404).json('Error when post an data')
        console.log(err)
    }
})


router.post('/dragdropwork/:unoron/:iddrop', async (req, res) => {
    try {
        if(req.params.iddrop === req.body.iddrag) {
            const currListWorks = await ListWorks.findById({_id: req.params.iddrop})
            const currWorks = currListWorks.works
            currWorks.splice(currWorks.indexOf(req.body.work), 1)
            currWorks.splice(currWorks.indexOf(req.body.idWorkdrop)+1, 0, new mongoose.Types.ObjectId(req.body.work))
            console.log(currWorks)
            await ListWorks.findByIdAndUpdate({_id: req.params.iddrop}, {works: currWorks})
        }
        else {
            // them vao cai minh keo den
            const currListWorks = await ListWorks.findById({_id: req.params.iddrop})
            const currWorks = currListWorks.works
            currWorks.splice(currWorks.indexOf(req.body.idWorkdrop)+1, 0, new mongoose.Types.ObjectId(req.body.work))
            console.log(currWorks)
            await ListWorks.findByIdAndUpdate({_id: req.params.iddrop}, {works: currWorks})

            //xoa o cai cu di
            const preListWorks = await ListWorks.findById({_id: req.body.iddrag})
            const preWorks = preListWorks.works
            preWorks.splice(preWorks.indexOf(req.body.work), 1)
            await ListWorks.findByIdAndUpdate({_id: req.body.iddrag}, {works: preWorks})
        }
        const listWorks = await ListWorks.findById({_id: req.params.iddrop}).populate('works')
        res.status(200).json(listWorks)
    }catch(err) {
        res.status(404).json('Error when post an data')
        console.log(err)
    }
})

router.post('/dragdroplist/:iddrop', async (req, res) => {
    try {
        // them vao cai minh keo den
        const listTemp = await ListTemp.findById({_id: '62b26cc946728371e8255520'})
        const currListWorks = listTemp.lists
        const dragList = await ListWorks.findById({_id: req.body.iddrag})
        const indexDrag = currListWorks.findIndex( x => x._id == req.body.iddrag)

        // them vao chỗ thằng drop
        const elSplice = currListWorks.splice(currListWorks.findIndex( x => x._id == req.params.iddrop), 1, dragList)
        currListWorks.splice(indexDrag, 1, elSplice[0])
        let arrIdList = []
        // console.log(currListWorks)
        currListWorks.map(list => {
            // console.log(list)
            arrIdList.push(list._id)
        })
        // console.log(arrIdList)
        // console.log(currListWorks)
        
        await ListTemp.findByIdAndUpdate({_id: '62b26cc946728371e8255520'}, {lists: arrIdList})
        const listWorks = await ListTemp.find().populate('lists')

        res.status(200).json(listWorks)
    }catch(err) {
        res.status(404).json('Error when update list data')
        console.log(err)
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const listWorks = await ListWorks.findByIdAndDelete({_id: req.params.id})
        const listAll = await ListWorks.find()
        let arrIdList = []
        listAll.map(list => {
            arrIdList.push(list._id)
        })
        const listItem = await ListTemp.findByIdAndUpdate({_id: '62b26cc946728371e8255520'}, {lists: arrIdList}).populate([{
            path: 'lists',
            model: 'ListWork',
            populate: {
                path: 'works',
                model: 'Work'
            }
        }])
        res.status(200).json(listItem)
    }catch(err) {
        res.status(404).json('Error when delete data')
        console.log(err)
    }
})

router.post('/deletework/:idlist', async (req, res) => {
    try {
        const currListWorks = await ListWorks.findById({_id: req.params.idlist})
        const currWorks = currListWorks.works

        currWorks.splice(currWorks.indexOf(req.body.workid), 1)

        await ListWorks.findByIdAndUpdate({_id: req.params.idlist}, {works: currWorks})
        const listAll = await ListWorks.find()
        let arrIdList = []
        listAll.map(list => {
            arrIdList.push(list._id)
        })
        const listItem = await ListTemp.findByIdAndUpdate({_id: '62b26cc946728371e8255520'}, {lists: arrIdList}).populate([{
            path: 'lists',
            model: 'ListWork',
            populate: {
                path: 'works',
                model: 'Work'
            }
        }])
        res.status(200).json(listItem)
    }catch(err) {
        res.status(404).json('Error when delete an work in list')
        console.log(err)
    }
})

module.exports = router