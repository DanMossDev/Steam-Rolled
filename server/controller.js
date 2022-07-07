const {
    fetchGames,
    fetchGameByID,
    fetchLinksByID
} = require('./model')

exports.getGames = async (req, res, next) => {
    const {language} = req.query
    try {
    const games = await fetchGames(language)
    res.status(200).send(games)
    } catch(err) { next(err) }
}

exports.getGameByID = async (req, res, next) => {
    const {app_ID} = req.params
    try {
    const game = await fetchGameByID(app_ID)
    res.status(200).send(game)
    } catch(err) { next(err) }
}

exports.getLinksByID = async (req, res, next) => {
    const {app_ID} = req.params
    try {
    const links = await fetchLinksByID(app_ID)
    res.status(200).send(links)
    } catch(err) { next(err) }
}