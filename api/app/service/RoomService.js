// service/RoomService.js
const { Room, Device, Calendar } = require("../models/models");

const getAllDevices = async (room_id) => {
  try {
    const devices = await Device.find({ room_id: room_id });
    return devices;
  } catch (error) {
    console.error("Error fetching devices: ", error);
    throw error;
  }
};

const getAllEvents = async (room_id) => {
  try {
    const currentDate = new Date();
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const currentTime = new Date();
    

    const events = await Calendar.find({
      room: room_id,
      startTime: {
        $gt: currentTime, // Greater than the current time
        $lt: endOfDay     // Less than the end of the day
      }
    });
    console.log(events);
    return events;
  } catch (error) {
    console.error("Error fetching events: ", error);
    throw error;
  }
};

const getEvent = async (event_id) => {
  try {
    const event = await Calendar.find({id : event_id});
    return event;
  } catch (error) {
    console.error("Error fetching event: ", error);
    throw error;
  }
};

module.exports = { getAllDevices, getAllEvents , getEvent};
