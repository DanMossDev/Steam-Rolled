const crypto = require('crypto')

const {
    fetchAllUsernames
} = require('./userModel')

exports.getAllUsernames = async (req, res, next) => {
    const users = await fetchAllUsernames()
    res.status(200).send(users)
}

exports.postNewUser = async (req, res, next) => {
    const {username, email, password} = req.body

    hashedWord = crypto.createHash('sha256')
    .update(password)
    .digest('base64')

    const user = await createNewUser(username, email, hashedWord)
    res.status(201).send(user)
}