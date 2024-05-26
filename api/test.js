const axios = require('axios');
const { MongoClient } = require('mongodb');

// Adafruit IO credentials
const ADAFRUIT_IO_USERNAME = 'ctrayleigh';
const ADAFRUIT_IO_KEY = 'aio_RDiG06qkwjR5AayxPFrO9k4bV5vn';
const FEED_NAMES = ['bbc-brightness' , 'bbc-temp', 'bbc-movement']; // Add your feed names here

// MongoDB connection details
const MONGODB_URI = 'mongodb+srv://tnghja:xkBQ62iIr4UNd87l@cluster0.ttmlzs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // e.g., 'mongodb://localhost:27017/'
const DATABASE_NAME = 'EnergyDB';
const COLLECTION_NAME = 'test';

async function fetchAdafruitData(feedName) {
    const url = `https://io.adafruit.com/api/v2/${ADAFRUIT_IO_USERNAME}/feeds/${feedName}/data`;
    const headers = {
        'X-AIO-Key': ADAFRUIT_IO_KEY
    };
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from Adafruit IO feed ${feedName}:`, error);
        throw error;
    }
}

async function storeToMongoDB(data) {
    const client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        await collection.insertMany(data);
    } catch (error) {
        console.error('Error storing data to MongoDB:', error);
        throw error;
    } finally {
        await client.close();
    }
}

(async () => {
    try {
        let allData = [];
        for (const feedName of FEED_NAMES) {
            const adafruitData = await fetchAdafruitData(feedName);
            const formattedData = adafruitData.map(item => ({
                value: item.value,
                timestamp: item.created_at,
                feed_id: feedName
            }));
            allData = allData.concat(formattedData);
        }
        await storeToMongoDB(allData);
        console.log('Data successfully stored to MongoDB.');
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
