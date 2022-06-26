const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const axios = require('axios')


function getAllApps() {
    return axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
}

async function scrapePage(appID, name) {
    const browser = await puppeteer.launch();
    try {
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
        await browser.close()
        return Promise.all([movLink, img1Link, img2Link, img3Link, description, name])
    }
    catch(err) {await browser.close()}

}


async function assignMedia() {
    try {
        getAllApps()
        .then(async (response) => {
            const games = response.data.applist.apps
            for(let i = 9405; i < games.length; i++) { //Scraped up to 9405
                console.log(i)
                try {
                    const game = games[i]
                    const [movLink, img1Link, img2Link, img3Link, description, name] = await scrapePage(game.appid, game.name)
                    
                    fs.readFile(`${__dirname}/data/games.json`, "utf-8")
                    .then(file => {
                        const currentList = JSON.parse(file)

                        if (!currentList.hasOwnProperty(`${name}`)) {
                            currentList[name] = {links: [movLink, img1Link, img2Link, img3Link], description}

                            fs.writeFile(`${__dirname}/data/games.json`, JSON.stringify(currentList, null, 2), "utf-8")
                        }
                    })
                }
                catch(err) {console.log('Game not found')}
            }
        })
    }
    catch(err) {console.log('Uh oh')}
}

assignMedia();


module.exports = { assignMedia };