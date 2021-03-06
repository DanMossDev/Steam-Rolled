const express = require('express')
const cors = require('cors')
const router = require('./server/router')

const {
    badEndpoint,
    customError, 
    psqlError,
    unhandledError
} = require('./server/errors')

const app = express();

app.use(express.json());
app.use(cors())
app.options('*', cors())

//Entry end points
app.get('/', (req, res) => res.status(200).send({msg: "Welcome to Steam Rolled! For a list of available end points, try a GET request to /api"}))

//Routing
app.use('/api', router)


//error handling
app.use('*', badEndpoint)
app.use(customError)
app.use(psqlError)
//app.use(unhandledError)
 

module.exports = app