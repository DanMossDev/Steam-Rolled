const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const axios = require('axios')


function getAllApps() {
    return axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
}

async function scrapePage(appID) {
    const browser = await puppeteer.launch();
    try {
        const page = await browser.newPage();
        await page.goto('https://store.steampowered.com/app/' + appID);
        
        const movie = await page.$$('.highlight_movie'); //scrape trailer from the highlight carousel
        const movSrc = await movie[1].getProperty('src');
        const movLink = movSrc.jsonValue();
        
        const images = await page.$$('.highlight_screenshot_link') //scrape images from the highlight carousel
        const img1Src = await images[0].getProperty('href');
        const img1Link = img1Src.jsonValue();
        const img2Src = await images[1].getProperty('href');
        const img2Link = img2Src.jsonValue();
        const img3Src = await images[2].getProperty('href');
        const img3Link = img3Src.jsonValue();

        const preview = await page.$('.game_description_snippet')
        const descriptionSpace = await preview.evaluate(el => el.textContent)
        const description = descriptionSpace.trim()

        const detailsBox = await page.$('#genresAndManufacturer')
        const details = await detailsBox.evaluate(el => el.textContent)

        const languageBox = await page.$('.game_language_options');
        const languages = await languageBox.evaluate(el => el.innerHTML)

        await browser.close()
        return Promise.all([movLink, img1Link, img2Link, img3Link, description, details, appID, languages])
    }
    catch(err) {await browser.close()}

}


async function assignMedia() {
    const validLanguages = ['English', 'Spanish', 'Portuguese', 'German', 'French', 'Italian', 'Czech', 'Danish', 'Dutch', 'Finnish', 'Greek', 'Hungarian', 'Japanese', 'Korean', 'Norwegian', 'Polish', 'Romanian', 'Russian', 'Simplified Chinese', 'Swedish', 'Traditional Chinese', 'Turkish', 'Ukranian', 'Vietnamese', 'Lithuanian', 'Arabic', 'Thai']
    try {
        getAllApps()
        .then(async (response) => {
            const games = response.data.applist.apps
            for(let i = 25; i < games.length; i++) {
                console.log(i)
                console.log(games[i])
                try {
                    const game = games[i]
                    const [movLink, img1Link, img2Link, img3Link, description, details, appID, languages] = await scrapePage(game.appid)

                    const detailsArray = details.replace(/\t/g, '').split('\n').map(el => el.trim()).filter(el => el !== '')
                    for (let i = 0; i < detailsArray.length; i++) {
                        if (detailsArray[i].charAt(detailsArray[i].length - 1) === ':') {
                            detailsArray[i] += ' ' + detailsArray[i+1]
                            detailsArray.splice(i+1, 1)
                        }
                    }
                    const detailsObject = {appID}
                    detailsArray.forEach(detail => {
                        const index = detail.indexOf(': ')
                        const key = detail.substring(0, index)
                        const value = detail.substring(index + 2)
                        if (key === 'Genre') detailsObject[key] = value.split(', ')
                        else detailsObject[key] = value
                    })
                    const supported_languages = []
                    validLanguages.forEach(language => {
                        if (languages.indexOf(language) !== -1) supported_languages.push(language)
                    })
                    detailsObject.languages = supported_languages
                    const genres = detailsObject.Genre
                    delete detailsObject.Genre
                    console.log(detailsObject)



                    fs.readFile(`${__dirname}/seeding/data/games.json`, "utf-8")
                    .then(file => {
                        const currentList = JSON.parse(file)
                        const lookup = currentList[0]

                        if (!lookup.hasOwnProperty(`${detailsObject.appID}`)) {
                            lookup[detailsObject.appID] = true
                            currentList.push({appID: detailsObject.appID, title: detailsObject.Title, links: [movLink, img1Link, img2Link, img3Link], details: detailsObject, genres, description})
                        }
                        fs.writeFile(`${__dirname}/seeding/data/games.json`, JSON.stringify(currentList, null, 2), "utf-8")
                    }).catch(err => console.log('uh oh'))
                }
                catch(err) {console.log('Game not found')}
            }
        })
    }
    catch(err) {console.log('Uh oh')}
}

assignMedia();


module.exports = { assignMedia };