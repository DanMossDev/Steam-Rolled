const db = require('../db/connection')

exports.fetchAllUsernames = () => {
    return db.query(`SELECT username FROM users`).then(({rows}) => rows)
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

exports.verifyUser = (email, password) => {
    return db.query(`
    SELECT user_id, username, email FROM users
    WHERE email = $1 AND password = $2
    `, [email, password]).then(({rows}) => {
        if (rows[0]) return rows[0]
        else return Promise.reject({statusCode: 400, msg: "Incorrect email or password"})
    })
}