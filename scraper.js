const puppeteer = require('puppeteer')
const GAMES = require('./games')

async function scrapePage(appID) {
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

    browser.close();
    return {movLink, img1Link, img2Link, img3Link};
}


function assignMedia(currentGameID) {
    currentGameID ? currentGameID : currentGameID = GAMES[Math.floor(Math.random() * GAMES.length)].ID; //if not called with an ID, pick a random one from the GAMES object
    let media = scrapePage(currentGameID);
    let result = media.then(function(result) {
        console.log(result)
        return result
    })
}

assignMedia();

module.exports = {assignMedia};