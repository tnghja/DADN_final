const axios = require('axios');
const adafruit = require('../config/adafruit.config');

// Hàm để bật thiết bị
const turnOnDevice = async (feedName) => {
  try {
    const response = await axios.post(`https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${feedName}/data`, {
      value: 'ON'
    }, {
      headers: {
        'X-AIO-Key': adafruit.feedKey
      }
    });
  } catch (error) {
    throw error;
  }
};

// Hàm để tắt thiết bị
const turnOffDevice = async (feedName) => {
  try {
    const response = await axios.post(`https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${feedName}/data`, {
      value: 'OFF'
    }, {
      headers: {
        'X-AIO-Key': adafruit.feedKey
      }
    });
  } catch (error) {
    throw error;
  }
};

module.exports = { turnOnDevice, turnOffDevice }