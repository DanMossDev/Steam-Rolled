const request = require('supertest')
const app = require('../app')
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
                    expect(game.hasOwnProperty('game_title')).toBe(true)
                    expect(game.hasOwnProperty('links')).toBe(true)
                    expect(Array.isArray(game.links)).toBe(true)
                    expect(game.hasOwnProperty('details')).toBe(true)
                    expect(game.hasOwnProperty('description')).toBe(true)
                    expect(game.hasOwnProperty('genres')).toBe(true)
                    expect(game.hasOwnProperty('languages')).toBe(true)
                })
                expect(body[0].links).toEqual([
                    [
                      'https://cdn.cloudflare.steamstatic.com/steam/apps/256876018/movie480_vp9.webm?t=1651484896',
                      'https://cdn.cloudflare.steamstatic.com/steam/apps/1924820/ss_4366f5b5702238813499ed51b8f3b150a9db8f5b.1920x1080.jpg?t=1656034711',
                      'https://cdn.cloudflare.steamstatic.com/steam/apps/1924820/ss_8190b6d226f2cc7898eebcdb20afe5cc612de370.1920x1080.jpg?t=1656034711',
                      'https://cdn.cloudflare.steamstatic.com/steam/apps/1924820/ss_cb618213dd7dec3c047b3c11b0e0b4deabca4ce9.1920x1080.jpg?t=1656034711'
                    ]
                  ])
            })
        })
        test('/api/games/:gameID', () => {
            return request(app).get('/api/games/1924820').expect(200).then(({body}) => {
                expect(body.game_title).toBe("StudioS Fighters: Climax Champions")
            })
        })
        test('/api/games/:gameID/links', () => {
            return request(app).get('/api/games/1924820/links').expect(200).then(({body}) => {
                expect(body).toEqual({
                    link1: 'https://cdn.cloudflare.steamstatic.com/steam/apps/256876018/movie480_vp9.webm?t=1651484896',
                    link2: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1924820/ss_4366f5b5702238813499ed51b8f3b150a9db8f5b.1920x1080.jpg?t=1656034711',
                    link3: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1924820/ss_8190b6d226f2cc7898eebcdb20afe5cc612de370.1920x1080.jpg?t=1656034711',
                    link4: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1924820/ss_cb618213dd7dec3c047b3c11b0e0b4deabca4ce9.1920x1080.jpg?t=1656034711'
                  })
            })
        })
    })
})

describe('Optional queries', () => {
    describe('GET /api/games', () => {
        test('/api/games?language=___', () => {
            return request(app).get('/api/games?language=english').expect(200).then(({body}) => {
                expect(body.length).not.toBe(0)
                body.forEach(game => {
                    expect(game.languages).toEqual(expect.arrayContaining(['English']))
                })
            })
        })
        test('/api/games?genre=___', () => {
            return request(app).get('/api/games?genre=')
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
        test('Valid but nonexistent query of app_ID', () => {
            return request(app).get('/api/games/12345').expect(404).then(({body}) => {
                expect(body.msg).toBe("Sorry, there is no game with that ID in our database.")
            })
        })
    })
    describe('psql errors', () => {
        test('Incorrect app_ID for get/api/games/:app_ID', () => {
            return request(app).get('/api/games/beans').expect(400).then(({body}) => {
                expect(body.msg).toBe("URL appID parametric entry of wrong type (expected integer, recieved string)")
            })
        })
        test('Incorrect app_ID for get/api/games/:app_ID/links', () => {
            return request(app).get('/api/games/beans/links').expect(400).then(({body}) => {
                expect(body.msg).toBe("URL appID parametric entry of wrong type (expected integer, recieved string)")
            })
        })
    })
})