// service/RoomService.js
const { Room, Device, Calendar, Threshold } = require("../models/models");

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
    // Get the current date and time
    const currentDate = new Date();
    
    // Adjust to Vietnam time (subtract 7 hours)
    const vietnamCurrentDate = new Date(currentDate.getTime() + 7 * 60 * 60 * 1000);
    
    // Calculate the end of the day in Vietnam time
    const endOfDay = new Date(vietnamCurrentDate);
    endOfDay.setHours(23, 59, 59, 999);

    console.log(vietnamCurrentDate);

    const events = await Calendar.find({});

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

const setThreshold = async (room_id, threshold, listDevices) => {
  try {
    await Threshold.deleteMany({ room_id });

    // Create a new threshold entry
    const newThreshold = new Threshold({
      room_id,
      threshold,
      devices: listDevices.map(device => ({
        device_id: device.deviceId,
        value: device.value !== undefined ? device.value : null
      }))
    });

    await newThreshold.save();

  } catch (error) {
    console.error("Error setting threshold:", error);
    throw new Error("An error occurred while setting the threshold");
  }
};

const getThreshold = async (room_id) => {
  try {
    const threshold = await Threshold.findOne({ room_id });
    if (threshold == null) {
      return null;
    }
    return threshold;

  } catch (error) {
    console.error("Error fetching threshold:", error);
  }
}
module.exports = { getAllDevices, getAllEvents , getEvent, setThreshold, getThreshold};
