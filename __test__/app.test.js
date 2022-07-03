const request = require('supertest')
const app = require('../server/app')
const db = require('../db/connection')
const seed = require('../seeding/seed.js')
const testData = require('../seeding/data/test-data/test-data.json').slice(1)
require('jest-sorted')

beforeEach(() => {
    return seed(testData)
})

afterAll(() => {
    db.end()
})

describe('Endpoints', () => {
    describe('GET', () => {
        test('/api/games', () => {
            return request(app).get('/api/games').expect(200).then(({body}) => {
                body.forEach(game => {
                    expect(game.hasOwnProperty('app_id')).toBe(true)
                })
            })
        })
        test('/api/games/:gameID', () => {
            
        })
    })
})