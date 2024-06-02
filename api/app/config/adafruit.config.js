const username = 'ctrayleigh';
const feedKey = 'aio_uvdM42xLKAFDBDr02rW8soQBHf1m';
const url = `https://io.adafruit.com/api/v2/${username}/feeds`;
const feedNames = ['bbc-brightness', 'bbc-temp', 'bbc-electronic', 'bbc-voltage', 'bbc-amperage'];
const feedNameFan = "bbc-button";
const feedNameLight = "bbc-light";

module.exports = { username, feedKey, feedNames, feedNameFan, feedNameLight, url };