const data = require('./data/games.json')
const seed = require('./seed')
const db = require('../db/connection')

seed(data).then(() => db.end());