const express = require('express')
const cors = require('cors')
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200
}

const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan')

const workRoute = require("./routes/work")
const listWorkRoute = require('./routes/listWorks')

dotenv.config()

mongoose.connect(process.env.MONGO_URL).then((result) => {
    console.log('Connected to mongoDB')
}).catch(err => console.log(err))

app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet())
app.use(morgan('common'))

app.use('/api/work', workRoute)
app.use('/api/listwork', listWorkRoute)

app.listen(4300, () => {
    console.log('Listening on port 4300...')
})