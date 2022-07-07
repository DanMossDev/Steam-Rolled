const express = require('express')
const {
    getGames,
    getGameByID,
    getLinksByID
} = require('./controller')

const router = express.Router()

router
    .route('')
    .get(getGames)

router
    .route('/:app_ID')
    .get(getGameByID)

router
    .route('/:app_ID/links')
    .get(getLinksByID)

module.exports = router