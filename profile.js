const https = require('https');
const http = require('http');


function getUserData(username) {
    try {
        const request = https.get(`https://teamtreehouse.com/${username}.json`, (res) => {
            processAPI(res, username);

        });
        request.on('error', (error) => printError(error));
    } catch (error) {
        printError(error);
    }
}

function processAPI(res, username) {
    if (res.statusCode === 200) {
        let body = '';
        res.on('data', (d) => {
            body += d.toString();
        });
        res.on('end', () => {
            try {
                const parsedBody = JSON.parse(body);
                printMessage(username, parsedBody.badges.length, parsedBody.points.total);
            } catch (error) {
                printError(error);
            }
        });
        return;
    }
    printError(new Error(`There was an error getting the profile for ${username} (Error Code ${res.statusCode} ${http.STATUS_CODES[res.statusCode]})`));
}

function printError(error) {
    console.error(error.message);
}

function printMessage(username, badgeCount, point) {
    const message = `${username} has ${badgeCount} total badge(s) and ${point} points in JavaScript`;
    console.log(message);
}

module.exports.getUserData = getUserData;