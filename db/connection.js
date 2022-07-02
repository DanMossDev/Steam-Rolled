const { Pool } = require('pg')
const ENV = process.env.NODE_ENV || 'dev'

require('dotenv').config({
    path: `${__dirname}/../.env.${ENV}`
})

if (!process.env.PGDATABASE) {
    throw new Error('No database has been assigned')
}

module.exports = new Pool();