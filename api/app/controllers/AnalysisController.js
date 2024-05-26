const axios = require("axios");
const adafruit = require("../config/adafruit.config");
const { EnergyLog, TempatureLog, LightLog } = require("../models/models")

async function fetchAdafruitData(feedName) {
    const url = `https://io.adafruit.com/api/v2/${adafruit.username}/feeds/${feedName}/data`;
    const headers = {
        'X-AIO-Key': adafruit.feedKey
    };
    try {
        const response = await axios.get(url, { headers });
        return response.data[0]; // Assuming we want the latest data
    } catch (error) {
        console.error(`Error fetching data from Adafruit IO feed ${feedName}:`, error);
        throw error;
    }
}

const storeData = async (req, res) => {
    try {
        let light, temperature, power, timestamp;
        for (const feedName of adafruit.feedNames ) {
            const adafruitData = await fetchAdafruitData(feedName);
            if (feedName === 'bbc-brightness') {
                light = adafruitData.value;
                timestamp = adafruitData.created_at;
                LightLog.create({
                    time: timestamp,
                    light: light,
                    room_id : "room_001"
                });
            } else if (feedName === 'bbc-temp') {
                tempature = adafruitData.value;
                timestamp = adafruitData.created_at;
                TempatureLog.create({
                    time: timestamp,
                    tempature: tempature,
                    room_id : "room_001"
                });
            } else if (feedName === 'bbc-electronic') {
                power = adafruitData.value;
                timestamp = adafruitData.created_at;
                EnergyLog.create({
                    time: timestamp,
                    power: power,
                    room_id : "room_001",
                    device_id : "device_001"
                });
            }
        }

        console.log('Data stored successfully');
    } catch (error) {
        console.error('An error occurred:', error);
    }
};
const home = async (req,res) => {
    try {
        const data = await EnergyLog.find()
        return res.json(data)
    }
    catch (error) {
        res.json({
            error: error
        })
    }
}

// setInterval(storeData, 5000)
module.exports = {
   home
}