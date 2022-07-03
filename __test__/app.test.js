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
                body.games.forEach(game => {
                    expect(game.hasOwnProperty('app_id')).toBe(true)
                    expect(game.hasOwnProperty('game_title')).toBe(true)
                    expect(game.hasOwnProperty('links')).toBe(true)
                    expect(Array.isArray(game.links)).toBe(true)
                    expect(game.hasOwnProperty('details')).toBe(true)
                    expect(game.hasOwnProperty('description')).toBe(true)
                })
            })
        })
        test('/api/games/:gameID', () => {
            return request(app).get('/api/games/1924820').expect(200).then(({body}) => {
                console.log(body)
                expect(body.game.game_title).toBe("StudioS Fighters: Climax Champions")
            })
        })
    })
})