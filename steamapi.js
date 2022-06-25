const axios = require('axios')

function getAllApps() {
    return axios.get('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
}

module.exports = { getAllApps }