const request = require('supertest')
const app = require('../app')
const db = require('../db/connection')
const seed = require('../seeding/seed')
const testData = require('../seeding/data/test-data/test-data.json')
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

        })
        test('/api/games/:gameID', () => {
            
        })
    })
})