const db = require('../db/connection')
const format = require('pg-format')
const data = require('./data/test-data/test-data.json').slice(1)
const {createRef} = require('../utils/createRef')


const seed = (data) => {
    return db.query(`
    DROP TABLE IF EXISTS games;
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
    );`
    ).then(() => {
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
        RETURNING *
        `, data.slice(0, 10).map(game => {
            return [game.appID, game.title, game.details, linkRefObj[game.links[0]], game.description]
        }))
    
        return db.query(queryString)
    }).then(({rows}) => console.log(rows))
}

seed(data)