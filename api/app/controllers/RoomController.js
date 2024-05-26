const roomService = require("../service/RoomService");
const schedule = require('node-schedule');
const DeviceService = require('../service/DeviceService');
const Device = require('../models/models');
const getAllDevices =  async (req, res) => {
    const roomId = req.params.id;
    try {
      const devices = await roomService.getAllDevices(roomId);
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  };
const getAllEvents = async (req, res) => {
  try {
    const roomId = req.params.id;
    const events = await roomService.getAllEvents(roomId);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching events' });
  }
};

const scheduleEvent = async (req, res) => {

    const roomId = req.params.id;
    const scheduleId = req.params.scheduleId;
    const event = await roomService.getEvent(scheduleId);
    const start = event.startTime;
    const end = event.endTime;

    const devices = await roomService.getAllDevices(roomId);
    
    // Schedule the start timer
    schedule.scheduleJob(start, async () => {
      console.log('Turn on all devices');
      try {
        for (const device of devices) {
      //    await DeviceService.turnOnDevice(device.feedName);
          await Device.updateOne({ _id: device._id }, { status: true });
        }
        console.log('All devices turned on successfully.');
      } catch (error) {
        console.error('Error turning on devices:', error);
      }
    });

    // Schedule the end timer
    schedule.scheduleJob(end, async () => {
      console.log('Turn off all devices');
      // Add logic to turn off devices here
      try {
        for (const device of devices) {
        //await DeviceService.turnOffDevice(device.feedName);
          await Device.updateOne({ _id: device._id }, { status: false });
        }
        console.log('All devices turned off successfully.');
      } catch (error) {
        console.error('Error turning off devices:', error);
      }
    });
    res.status(200).json({ message: 'Schedule created successfully' }); // Phản hồi với thông điệp thích hợp
  
};
module.exports = {
  getAllDevices, getAllEvents, scheduleEvent
}
  