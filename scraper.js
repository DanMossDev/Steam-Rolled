const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const steamAPI = require('./steamapi')
const axios = require('axios')


function getAllApps() {
    return axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
}

async function scrapePage(appID, name) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://store.steampowered.com/app/' + appID);

        let movie = await page.$$('.highlight_movie'); //scrape trailer from the highlight carousel
        let movSrc = await movie[1].getProperty('src');
        let movLink = movSrc.jsonValue();

        let images = await page.$$('.highlight_screenshot_link') //scrape images from the highlight carousel
        let img1Src = await images[0].getProperty('href');
        let img1Link = img1Src.jsonValue();
        let img2Src = await images[1].getProperty('href');
        let img2Link = img2Src.jsonValue();
        let img3Src = await images[2].getProperty('href');
        let img3Link = img3Src.jsonValue();

        let preview = await page.$('.game_description_snippet')
        let descriptionSpace = await preview.evaluate(el => el.textContent)
        let description = descriptionSpace.trim()
        browser.close();
        return Promise.all([movLink, img1Link, img2Link, img3Link, description, name])
    }
    catch(err) {console.log("Whoops")}
}


async function assignMedia() {
    try {
        const gamesDataArray = []
        getAllApps()
        .then(async (response) => {
            const games = response.data.applist.apps
            for(let i = 0; i < 100; i++) {
                try {
                const game = games[i]
                const [movLink, img1Link, img2Link, img3Link, description, name] = await scrapePage(game.appid, game.name)

                console.log(movLink, img1Link, img2Link, img3Link, description, name)

                //PLAN: From here, read a JSON file for an object of games data (sorted by game name), push new game into the object, store JSON with new game
                }
                catch(err) {console.log('Game not found')}
            }
        })
    }
    catch(err) {console.log('Uh oh')}
}

assignMedia();


module.exports = { assignMedia };