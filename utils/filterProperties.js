const fs = require('fs/promises')
const games = require('../seeding/data/games.json')

const newGames = games.filter(game => {
    return (game.hasOwnProperty("appID") && game.hasOwnProperty("title") && game.hasOwnProperty("links") && game.hasOwnProperty("details") && game.hasOwnProperty("genres") && game.hasOwnProperty("languages") && game.hasOwnProperty("description"))
})

newGames.unshift(games[0])

fs.writeFile(`${__dirname}/../seeding/data/filteredGames.json`, JSON.stringify(newGames, null, 2))