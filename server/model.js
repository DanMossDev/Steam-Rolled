const db = require('../db/connection')

exports.fetchGames = (language) => {
    if (language) {
        const validLanguages = ['English', 'Spanish', 'Portuguese', 'German', 'French', 'Italian', 'Czech', 'Danish', 'Dutch', 'Finnish', 'Greek', 'Hungarian', 'Japanese', 'Korean', 'Norwegian', 'Polish', 'Romanian', 'Russian', 'Simplified Chinese', 'Swedish', 'Traditional Chinese', 'Turkish', 'Ukranian', 'Vietnamese', 'Lithuanian', 'Arabic', 'Thai']
        language = language.slice(0,1).toUpperCase() + language.slice(1).toLowerCase()
        if (validLanguages.indexOf(language) === -1) return Promise.reject({statusCode: 400, msg: "That isn't a valid language on Steam"})
    }
    return db.query(`
    SELECT app_id, game_title, ARRAY_AGG((link1, link2, link3, link4)) AS links, details, description FROM games
    JOIN links ON links.link_id = games.links
    GROUP BY games.app_id
    `)
    .then(({rows}) => {
        rows.forEach(game => {
            game.links = game.links.slice(3, -3).split(',') //convert links from a string to an array
        })
        if (language) rows = rows.filter(row => row.details.languages.indexOf(language) !== -1)
        
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