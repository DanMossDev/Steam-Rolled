const express = require('express')
const {
    getGames,
    getGameByID
} = require('./controller')

const app = express();

app.use(express.json());

//endpoints
app.get('/api/games', getGames)

app.get('/api/games/:app_ID', getGameByID)

//error handling
 

module.exports = app