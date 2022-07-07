const express = require('express')
const router = require('./server/router')

const {
    badEndpoint,
    customError, 
    psqlError
} = require('./server/errors')

const app = express();

app.use(express.json());

//Entry end points
app.get('/', (req, res) => res.status(200).send({msg: "Welcome to Steam Rolled! For a list of available end points, try a GET request to /api"}))

//Routing
app.use('/api', router)


//error handling
app.use('*', badEndpoint)

app.use(customError)

app.use(psqlError)
 

module.exports = app