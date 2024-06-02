const axios = require('axios');
const adafruit = require('../config/adafruit.config');
const { Device } = require('../models/models');

// Function to turn on the device
const turnOnDevice = async (feedName) => {
  try {
    // Tìm thiết bị theo device_id
    const device = await Device.findOne({ device_id: feedName });
    if (!device) {
      throw new Error('Device not found');
    }
    console.log(device.type === 'light')
    // Kiểm tra loại thiết bị và thực hiện yêu cầu axios tương ứng
    let response;
    if (device.type === 'light') {
      response = await axios.post(`https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${adafruit.feedNameLight}/data`, {
        value: 1
      }, {
         headers : {
          'X-AIO-Key': adafruit.feedKey,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
    } else if (device.type === 'fan') {
      response = await axios.post(`https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${adafruit.feedNameFan}/data`, {
        value: 'ON'
      }, {
        headers : {
          'X-AIO-Key': adafruit.feedKey,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
    }

    await Device.updateOne({ device_id: feedName }, { status: true });
    return feedName;
  } catch (error) {
    throw error;
  }
};

const turnOffDevice = async (feedName) => {
  try {
    // Tìm thiết bị theo device_id
    const device = await Device.findOne({ device_id: feedName });
    console.log(device)

    // Kiểm tra loại thiết bị và thực hiện yêu cầu axios tương ứng
    let response;
    if (device.type === 'light') {
      response = await axios.post(`https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${adafruit.feedNameLight}/data`, {
        value: 0
      }, {
        headers : {
          'X-AIO-Key': adafruit.feedKey,
          'Content-Type': 'application/json'
        }
      });
      console.log(response)
    } else if (device.type === 'fan') {
      response = await axios.post(`https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${adafruit.feedNameFan}/data`, {
        value: 'OFF'
      }, {
        headers : {
          'X-AIO-Key': adafruit.feedKey,
          'Content-Type': 'application/json'
        }
      });
    }
    await Device.updateOne({ device_id: feedName }, { status: false });
    return feedName;
  } catch (error) {
    throw error;
  }
};

const updateFanSpeed = async (device_id,value) => {
  try {
    // Find the device by device_id
    const device = await Device.findOne({ device_id: device_id });
    if (!device) {
      throw new Error('Device not found');
    }

    // Check the type of device and perform the appropriate axios request
    let response;
    if (device.type === 'fan') {
      response = await axios.post(`https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${adafruit.feedNameFan}/data`, {
        value: value
      }, {
        headers: {
          'X-AIO-Key': adafruit.feedKey,
          'Content-Type': 'application/json'
        }
      });
    }

    // Update the device's value in the database
    await Device.updateOne({ device_id: device_id }, { value: value });
    return device_id;
  } catch (error) {
    throw error;
  }

};

module.exports = { turnOnDevice, turnOffDevice,updateFanSpeed };
