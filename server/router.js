const express = require('express')
const {
    getEndpoints,
    getGames,
    getGameByID,
    getLinksByID
} = require('./controller')

const router = express.Router()

router
    .route('')
    .get(getEndpoints)

router
    .route('/games')
    .get(getGames)

router
    .route('/games/:app_ID')
    .get(getGameByID)

router
    .route('/games/:app_ID/links')
    .get(getLinksByID)

module.exports = router