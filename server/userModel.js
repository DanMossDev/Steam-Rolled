const db = require('../db/connection')

exports.fetchAllUsernames = () => {
    return db.query(`SELECT username FROM users`)
}

exports.postNewUser = (username, email, password) => {
    return db.query(`
    INSERT INTO users
    (username, email, password)
    VALUES
    ($1, $2, $3)
    RETURNING username, email
    `).then(({rows}) => rows[0])
}