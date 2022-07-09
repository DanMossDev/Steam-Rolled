const crypto = require('crypto')

const {
    fetchAllUsernames,
    createNewUser,
    verifyUser
} = require('./userModel')

exports.getAllUsernames = async (req, res, next) => {
    const users = await fetchAllUsernames()
    res.status(200).send(users)
}

exports.postNewUser = async (req, res, next) => {
    const {username, email, password} = req.body
    if (!username || !email || !password) return next({statusCode: 400, msg: "Please enter a username, email, and password"})

    hashedWord = crypto.createHash('sha256')
    .update(password)
    .digest('base64')
    try {
    const user = await createNewUser(username, email, hashedWord)
    res.status(201).send(user)
    } catch (err) { next(err) }
}

exports.userLogin = async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password) return next({statusCode: 400, msg: "Please enter your email and password"})

    hashedWord = crypto.createHash('sha256')
    .update(password)
    .digest('base64')
    try {
    const userDetails = await verifyUser(email, hashedWord)
    res.status(200).send(userDetails)
    } catch (err) { next(err) }
}