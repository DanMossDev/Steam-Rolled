const express = require('express')
const router = require('./server/router')

const {
    badEndpoint,
    customError, 
    psqlError
} = require('./server/errors')

const app = express();

app.use(express.json());

//Routing
app.use('/api/games', router)

//error handling
app.use('*', badEndpoint)

app.use(customError)

app.use(psqlError)
 

module.exports = app