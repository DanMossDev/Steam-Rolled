const db = require('../db/connection')

exports.fetchGames = () => {
    return db.query(`
    SELECT app_id, game_title, ARRAY_AGG((link1, link2, link3, link4)) AS links, details, description FROM games
    JOIN links ON links.link_id = games.links
    GROUP BY games.app_id
    `)
    .then(({rows}) => {
        rows.forEach(game => {
            game.links = game.links.slice(3, -3).split(',') //convert links from a string to an array
        })
        return rows
    })
}

exports.fetchGameByID = (app_ID) => {
    return db.query(`
    SELECT app_id, game_title, ARRAY_AGG((link1, link2, link3, link4)) AS links, details, description FROM games
    JOIN links ON links.link_id = games.links
    WHERE games.app_id = $1
    GROUP BY games.app_id
    `, [app_ID])
    .then(({rows}) => {
        rows.forEach(game => {
            game.links = game.links.slice(3, -3).split(',') //convert links from a string to an array
        })
        return rows[0]
    })
}