const db = require('../db/connection')

exports.fetchAllUsernames = () => {
    return db.query(`SELECT username FROM users`)
}

exports.createNewUser = (username, email, password) => {
    return db.query(`
    INSERT INTO users
    (username, email, password)
    VALUES
    ($1, $2, $3)
    RETURNING username, email
    `, [username, email, password]).then(({rows}) => rows[0])
}