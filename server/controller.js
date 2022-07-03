const {
    fetchGames,
    fetchGameByID
} = require('./model')

exports.getGames = (req, res) => {
    fetchGames()
    .then(games => {
        res.send({games})
    })
}

exports.getGameByID = (req, res) => {
    const {app_ID} = req.params
    fetchGameByID(app_ID)
    .then(game => {
        res.send({game})
    })
}