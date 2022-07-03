const {
    fetchGames,
    fetchGameByID
} = require('./model')

exports.getGames = (req, res, next) => {
    const {language} = req.query
    fetchGames(language)
    .then(games => {
        res.send({games})
    })
    .catch(err => next(err))
}

exports.getGameByID = (req, res, next) => {
    const {app_ID} = req.params
    fetchGameByID(app_ID)
    .then(game => {
        res.send({game})
    })
    .catch(err => next(err))
}