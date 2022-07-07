 # <center> Steam Rolled API </center>

## <center> https://steam-rolled.herokuapp.com/ </center>

## Intro
---
Hey there! This API allows users to access details about a majority of games available on Steam. The [Steam API](https://steamcommunity.com/dev) provides some great utility, but I personally found it lacked some key features I needed to produce a project; so I knocked this together.

This project comprises two parts, one which is hosted at the above link and another which you are welcome to fork, download, or in any other means use yourself - "scraper.js"

<br>

### Scraper.JS
---
Scraper is a very simple web scraping program using Puppeteer to collect this information from Steam into a JSON file. It requests all app IDs from Steam's API and accesses them via Puppeteer's headless browser and collects information including the name, description, genres, and links to the promotional movies and images. It could easily be expanded or adjusted to scrape whichever information you prefer!

### Steam Rolled API
---
The second part is the API hosted on Heroku, it essentially just collates all the data scraped into a database for remote access. As of yet, there is no need for auth but that is something I am looking to add in the future. It allows you to select an individual game by ID, or to return a filtered array by genre or language; this will likely be expanded in the future too - if there are any specific features you want feel free to drop me a message!

<br>

### Final Word
---
Thanks for checking out my little project, I hope it was helpful! <br>
Dan