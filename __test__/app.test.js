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
        test('/api/games?language=english', () => {
            return request(app).get('/api/games?language=english').expect(200).then(({body}) => {
                expect(body.games.length).not.toBe(0)
                body.games.forEach(game => {
                    expect(game.details.languages).toEqual(expect.arrayContaining(['English']))
                })
            })
        })
        test('/api/games/:gameID', () => {
            return request(app).get('/api/games/1924820').expect(200).then(({body}) => {
                expect(body.game.game_title).toBe("StudioS Fighters: Climax Champions")
            })
        })
    })
})

describe('Error handling', () => {
    describe('bad paths', () => {
        test('Bad path', () => {
            return request(app).get('/beans').expect(400).then(({body}) => {
                expect(body.msg).toBe("Endpoint doesn't exist, please view documentation for valid endpoints")
            })
        })
    })
    describe('custom errors', () => {
        test('Incorrect language query', () => {
            return request(app).get('/api/games?language=beans').expect(400).then(({body}) => {
                expect(body.msg).toBe("That isn't a valid language on Steam")
            })
        })
    })
    describe('psql errors', () => {
        test('Incorrect data in param', () => {
            return request(app).get('/api/games/beans').expect(400).then(({body}) => {
                expect(body.msg).toBe("URL appID parametric entry of wrong type (expected integer, recieved string)")
            })
        })
    })
})