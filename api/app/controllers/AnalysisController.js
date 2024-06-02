const axios = require("axios");
const adafruit = require("../config/adafruit.config");
const { VoltageLog, AmperageLog, EnergyLog, TempatureLog, LightLog } = require("../models/models")

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
                    date: timestamp,
                    light: light,
                    room_id : "room_001"
                });
            } else if (feedName === 'bbc-temp') {
                tempature = adafruitData.value;
                timestamp = adafruitData.created_at;
                TempatureLog.create({
                    date: timestamp,
                    temperature: temperature,
                    room_id : "room_001"
                });
            } else if (feedName === 'bbc-electronic') {
                power = adafruitData.value;
                timestamp = adafruitData.created_at;
            
                // Log with original power value for device_001
                EnergyLog.create({
                    date: timestamp,
                    power: power,
                    room_id: "room_001",
                    device_id: "device_001"
                });
            
                // Helper function to generate a random power value between power and power - 100
                function getRandomPower(basePower) {
                    return basePower - Math.floor(Math.random() * 101);
                }
            
                // Log with random power value for device_002
                EnergyLog.create({
                    date: timestamp,
                    power: getRandomPower(power),
                    room_id: "room_001",
                    device_id: "device_002"
                });
            
                // Log with random power value for device_003
                EnergyLog.create({
                    date: timestamp,
                    power: getRandomPower(power),
                    room_id: "room_001",
                    device_id: "device_003"
                });
            
                // Log with random power value for device_004
                EnergyLog.create({
                    date: timestamp,
                    power: getRandomPower(power),
                    room_id: "room_001",
                    device_id: "device_004"
                });
            }
            
            else if (feedName === 'bbc-voltage') {
                power = adafruitData.value;
                timestamp = adafruitData.created_at;
            
                // Log with original power value for device_001
                VoltageLog.create({
                    date: timestamp,
                    voltage: power,
                    room_id: "room_001",
                    device_id: "device_001"
                });
            
                // Helper function to generate a random voltage value between power and power - 20
                function getRandomVoltage(basePower) {
                    return basePower - Math.floor(Math.random() * 21);
                }
            
                // Log with random voltage value for device_002
                VoltageLog.create({
                    date: timestamp,
                    voltage: getRandomVoltage(power),
                    room_id: "room_001",
                    device_id: "device_002"
                });
            
                // Log with random voltage value for device_003
                VoltageLog.create({
                    date: timestamp,
                    voltage: getRandomVoltage(power),
                    room_id: "room_001",
                    device_id: "device_003"
                });
            
                // Log with random voltage value for device_004
                VoltageLog.create({
                    date: timestamp,
                    voltage: getRandomVoltage(power),
                    room_id: "room_001",
                    device_id: "device_004"
                });
            }
            
            else if (feedName === 'bbc-amperage') {
    power = adafruitData.value;
    timestamp = adafruitData.created_at;

    // Log with original power value for device_001
    AmperageLog.create({
        date: timestamp,
        amperage: power,
        room_id: "room_001",
        device_id: "device_001"
    });

    // Helper function to generate a random amperage value between power and power - 5
    function getRandomAmperage(basePower) {
        return basePower - Math.floor(Math.random() * 0.2);
    }

    // Log with random amperage value for device_002
    AmperageLog.create({
        date: timestamp,
        amperage: getRandomAmperage(power),
        room_id: "room_001",
        device_id: "device_002"
    });

    // Log with random amperage value for device_003
    AmperageLog.create({
        date: timestamp,
        amperage: getRandomAmperage(power),
        room_id: "room_001",
        device_id: "device_003"
    });

    // Log with random amperage value for device_004
    AmperageLog.create({
        date: timestamp,
        amperage: getRandomAmperage(power),
        room_id: "room_001",
        device_id: "device_004"
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

// setInterval(storeData, 30000)
module.exports = {
   home
}