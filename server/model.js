const db = require('../db/connection')
const {languages} = require('../utils/tags')

exports.fetchGames = (language) => {
    let query = `
    SELECT games.app_id, game_title, JSON_AGG(DISTINCT JSONB_BUILD_ARRAY(link1, link2, link3, link4)) AS links, ARRAY_AGG(DISTINCT genre) AS genres, ARRAY_AGG(DISTINCT language) AS languages, details, description FROM games
    JOIN links ON links.link_id = games.links
    JOIN games_genres ON games_genres.app_id = games.app_id
    JOIN games_languages ON games_languages.app_id = games.app_id
    `
    
    query += " GROUP BY games.app_id"
    if (language) {
        language = language.slice(0,1).toUpperCase() + language.slice(1).toLowerCase()
        if (languages.indexOf(language) === -1) return Promise.reject({statusCode: 400, msg: "That isn't a valid language on Steam"})
        else query += ` HAVING '${language}' = ANY(ARRAY_AGG(language))`
    }
    
    return db.query(query)
    .then(({rows}) => rows)
}

exports.fetchGameByID = (app_ID) => {
    return db.query(`
    SELECT games.app_id, game_title, JSON_AGG(DISTINCT JSONB_BUILD_ARRAY(link1, link2, link3, link4)) AS links, ARRAY_AGG(DISTINCT genre) AS genres, ARRAY_AGG(DISTINCT language) AS languages, details, description FROM games
    JOIN links ON links.link_id = games.links
    JOIN games_genres ON games_genres.app_id = games.app_id
    JOIN games_languages ON games_languages.app_id = games.app_id
    WHERE games.app_id = $1
    GROUP BY games.app_id
    `, [app_ID])
    .then(({rows}) => rows[0])
}

exports.fetchLinksByID = (app_ID) => {
    return db.query(`
    SELECT link1, link2, link3, link4 FROM links
    JOIN games ON games.links = links.link_id
    WHERE app_id = $1
    `, [app_ID])
    .then(({rows}) => rows[0])
}