const https = require('https');
const http = require('http');

/**
 * Get request with argument passed by user.
 * @param {string} username
 */
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

/**
 * Build and parse the response from the get request. Sending the desired parsed info to printMessage()
 * @param res String. Get request response
 * @param {string} username
 */
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

/**
 * Print an error to the console.
 * @param error The error that is passed
 */
function printError(error) {
    console.error(error.message);
}

/**
 * Print the collected API data to the console.
 * @param {string} username
 * @param {number} badgeCount
 * @param {number} points
 */
function printMessage(username, badgeCount, points) {
    const message = `${username} has ${badgeCount} total badge(s) and ${points} points in JavaScript`;
    console.log(message);
}

module.exports.getUserData = getUserData;
