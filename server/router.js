const express = require('express')
const {
    getEndpoints,
    getGames,
    getGameByID,
    getLinksByID
} = require('./controller')

const {
    getAllUsernames,
    userLogin,
    postNewUser
} = require('./userController')

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

router
    .route('/users')
    .get(getAllUsernames)

router
    .route('/users/login')
    .post(userLogin)
    //.patch(changePassword)

router
    .route('/users/register')
    .post(postNewUser)
    //.delete(deleteUser)


module.exports = router