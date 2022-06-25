const puppeteer = require('puppeteer')
const GAMES = require('./games')
const fs = require('fs/promises')
const steamAPI = require('./steamapi')

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
    catch(err) {assignMedia()}
}


async function assignMedia() {
    try {
        steamAPI.getAllApps()
        .then(response => {
            const games = response.data.applist.apps
            const randomGameNum = Math.floor(Math.random() * games.length)

            return {id: games[randomGameNum].appid, game: games[randomGameNum].name}
        })
        .then((game) => {
            console.log(game)
            return Promise.all([scrapePage(game.id, game.game)])
        })
        .then((response) => {
            const [[movLink, img1Link, img2Link, img3Link, description, name]] = response
            console.log(movLink)
            console.log(img1Link) 
            console.log(img2Link)
            console.log(img3Link)
            console.log(description)
            console.log(name)
        })
    }
    catch(err) {console.log('Uh oh')}
}

module.exports = { assignMedia };