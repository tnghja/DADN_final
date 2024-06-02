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

const convertToVietnamTime = (utcDate) => {
  const date = new Date(utcDate);
  date.setHours(date.getHours() - 7);
  return date;
}

const scheduleEvent = async (req, res) => {
  try {
      const roomId = req.params.id;
      const scheduleId = req.params.scheduleId;
      
      const event = await roomService.getEvent(scheduleId);
      if (!event || event.length === 0) {
          return res.status(404).json({ message: 'Event not found' });
      }

      // Chuyển đổi thời gian từ UTC sang giờ Việt Nam
      const start = convertToVietnamTime(event[0].startTime);
      const end = convertToVietnamTime(event[0].endTime);
      console.log(start, end);
      const devices = await roomService.getAllDevices(roomId);
      if (!devices || devices.length === 0) {
          return res.status(404).json({ message: 'No devices found in the room' });
      }

      // Schedule the start timer
      schedule.scheduleJob(start, async () => {
          console.log('Turn on all devices');
          try {
              for (const device of devices) {
                  await DeviceService.turnOnDevice(device.device_id);
              }
              console.log('All devices turned on successfully.');
          } catch (error) {
              console.error('Error turning on devices:', error);
          }
      });

      // Schedule the end timer
      schedule.scheduleJob(end, async () => {
          console.log('Turn off all devices');
          try {
              for (const device of devices) {
                  await DeviceService.turnOffDevice(device.device_id);
              }
              console.log('All devices turned off successfully.');
          } catch (error) {
              console.error('Error turning off devices:', error);
          }
      });
      res.status(200).json({ message: 'Schedule created successfully' });

  } catch (error) {
      console.error('Error scheduling event:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};

const setThreshold = async (req, res) => {
  const roomId = req.params.id;
  const amperageThreshold = req.body.amperageThreshold;
  const listDevices = req.body.devices;
  try {
    await roomService.setThreshold(roomId, amperageThreshold, listDevices);
    res.status(200).json({ message: 'Threshold set successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while setting the threshold', error });
  }
}

const getThreshold = async (req, res) => {
  const roomId = req.params.id;
  try {
    const threshold = await roomService.getThreshold(roomId);
    res.status(200).json(threshold);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the threshold', error });
  }
}
module.exports = {
  getAllDevices, getAllEvents, scheduleEvent,setThreshold, getThreshold
}
  