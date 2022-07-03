const data = require('./data/games.json').slice(1)
const seed = require('./seed')
const db = require('../db/connection')

seed(data).then(() => db.end());