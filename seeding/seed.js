const db = require('../db/connection')
const format = require('pg-format')
const {createRef} = require('../utils/createRef')
const {genres, languages} = require('../utils/tags')

const seed = (data) => {
    return db.query(`
    DROP TABLE IF EXISTS games_genres CASCADE;
    DROP TABLE IF EXISTS games CASCADE;
    DROP TABLE IF EXISTS games_languages CASCADE;
    DROP TABLE IF EXISTS languages CASCADE;
    DROP TABLE IF EXISTS genres CASCADE;
    DROP TABLE IF EXISTS links;
    CREATE TABLE links (
        link_id SERIAL PRIMARY KEY,
        link1 VARCHAR(255),
        link2 VARCHAR(255),
        link3 VARCHAR(255),
        link4 VARCHAR(255)
    );
    CREATE TABLE games (
        app_id INT PRIMARY KEY,
        game_title VARCHAR(255),
        details JSONB,
        links INT REFERENCES links(link_id),
        description TEXT
    );
    CREATE TABLE genres (
        genre VARCHAR(100) PRIMARY KEY
    );
    CREATE TABLE games_genres (
        app_id INT REFERENCES games(app_id),
        genre VARCHAR(100) REFERENCES genres(genre)
    );
    CREATE TABLE languages (
        language VARCHAR(100) PRIMARY KEY
    );
    CREATE TABLE games_languages (
        app_id INT REFERENCES games(app_id),
        language VARCHAR(100) REFERENCES languages(language)
    )`
    ).then(() => {
        const genresString = format(`
        INSERT INTO genres
        (genre)
        VALUES
        %L`, genres.map(genre => [genre]))

        return db.query(genresString)
    })
    .then(() => {
        const languagesString = format(`
        INSERT INTO languages
        (language)
        VALUES
        %L`, languages.map(language => [language]))

        return db.query(languagesString)
    })
    .then(() => {
        const linkString = format(`
        INSERT INTO links
        (link1, link2, link3, link4)
        VALUES
        %L
        RETURNING *
        ;`, data.map(game => {
            return game.links
        }))
        return db.query(linkString)
    }).then(({rows}) => {
        const linkRefObj = createRef(rows)

        const queryString = format(`
        INSERT INTO games
        (app_id, game_title, details, links, description)
        VALUES
        %L
        `, data.map(game => {
            return [game.appID, game.title, game.details, linkRefObj[game.links[0]], game.description]
        }))
    
        return db.query(queryString)
    })
    .then(() => {
        const gamesGenresArray = []
        data.forEach((game, i) => {
            game.genres.forEach(genrePresent => {
                gamesGenresArray.push([game.appID, `${genrePresent}`])
            })
        })

        const gameGenresQuery = format(`
        INSERT INTO games_genres
        (app_id, genre)
        VALUES
        %L
        `, gamesGenresArray)

        return db.query(gameGenresQuery)
    })
    .then(() => {
        const gamesLanguagesArray = []

        data.forEach(game => {
            game.languages.forEach(languagePresent => {
                gamesLanguagesArray.push([game.appID, `${languagePresent}`])
            })
        })

        const gameLanguagesQuery = format(`
        INSERT INTO games_languages
        (app_id, language)
        VALUES
        %L
        `, gamesLanguagesArray)

        return db.query(gameLanguagesQuery)
    })
}

module.exports = seed