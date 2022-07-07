const express = require('express')
const router = require('./router')

const {
    badEndpoint,
    customError, 
    psqlError
} = require('./errors')

const app = express();

app.use(express.json());

//Routing
app.use('/api/games', router)

//error handling
app.use('*', badEndpoint)

app.use(customError)

app.use(psqlError)
 

module.exports = app