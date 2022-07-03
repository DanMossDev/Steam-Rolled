const express = require('express')
const {
    getGames,
    getGameByID
} = require('./controller')

const {
    badEndpoint,
    customError, 
    psqlError
} = require('./errors')

const app = express();

app.use(express.json());

//endpoints
app.get('/api/games', getGames)

app.get('/api/games/:app_ID', getGameByID)

//error handling
app.use('*', badEndpoint)

app.use(customError)

app.use(psqlError)
 

module.exports = app