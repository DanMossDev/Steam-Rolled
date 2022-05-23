const puppeteer = require('puppeteer')

let urlTemplate = 'https://store.steampowered.com/app/'
let currentAppID = '1222670'

async function scrapePage(url, appID) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url + appID);

    let movie = await page.$$('.highlight_movie');
    let src = await movie[1].getProperty('src');
    let srcText = src.jsonValue();


  //  let [screenshots] = await page.$x('//*[@id="appHubAppName"]')

    console.log(srcText)

    browser.close();
}

scrapePage(urlTemplate, currentAppID)