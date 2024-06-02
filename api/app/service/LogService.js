const { Device, EnergyLog, TempatureLog, LightLog, AmperageLog, VoltageLog } = require("../models/models");

const getAllDeviceEnergyLog = async (device_id) => {
  try {
    // Fetch logs filtered by device_id, sorted by date in descending order, limit to 12
    const logs = await EnergyLog.find({ device_id }).sort({ date: -1 }).limit(12);

    // Fetch device details and combine with logs
    const detailedLogs = await Promise.all(logs.map(async (log) => {
      const device = await Device.findOne({ device_id: log.device_id });
      return {
        name: device.deviceName,
        power: log.power,
        date: log.date
      };
    }));

    // Group logs by device name
    const groupedLogs = detailedLogs.reduce((acc, log) => {
      if (!acc[log.name]) {
        acc[log.name] = [];
      }
      acc[log.name].push({
        power: log.power,
        date: log.date
      });
      return acc;
    }, {});

    // Format the result as an array of objects with name and data, reversed to have the oldest first
    const result = Object.keys(groupedLogs).map(name => ({
      name,
      data: groupedLogs[name].reverse() // Reverse the data array for each device name
    }));

    return result;
  } catch (error) {
    console.error("Error fetching device logs: ", error);
    throw error;
  }
};

const getAllDeviceVoltageLog = async (device_id) => {
  try {
    // Fetch logs filtered by device_id, sorted by date in descending order, limit to 12
    const logs = await VoltageLog.find({ device_id }).sort({ date: -1 }).limit(12);

    // Fetch device details and combine with logs
    const detailedLogs = await Promise.all(logs.map(async (log) => {
      const device = await Device.findOne({ device_id: log.device_id });
      return {
        name: device.deviceName,
        voltage: log.voltage,
        date: log.date
      };
    }));

    // Group logs by device name
    const groupedLogs = detailedLogs.reduce((acc, log) => {
      if (!acc[log.name]) {
        acc[log.name] = [];
      }
      acc[log.name].push({
        voltage: log.voltage,
        date: log.date
      });
      return acc;
    }, {});

    // Format the result as an array of objects with name and data, reversed to have the oldest first
    const result = Object.keys(groupedLogs).map(name => ({
      name,
      data: groupedLogs[name].reverse() // Reverse the data array for each device name
    }));

    return result;
  } catch (error) {
    console.error("Error fetching device logs: ", error);
    throw error;
  }
};

const getAllDeviceAmperageLog = async (device_id) => {
  try {
    // Fetch logs filtered by device_id, sorted by date in descending order, limit to 12
    const logs = await AmperageLog.find({ device_id }).sort({ date: -1 }).limit(12);

    // Fetch device details and combine with logs
    const detailedLogs = await Promise.all(logs.map(async (log) => {
      const device = await Device.findOne({ device_id: log.device_id });
      return {
        name: device.deviceName,
        amperage: log.amperage,
        date: log.date
      };
    }));

    // Group logs by device name
    const groupedLogs = detailedLogs.reduce((acc, log) => {
      if (!acc[log.name]) {
        acc[log.name] = [];
      }
      acc[log.name].push({
        amperage: log.amperage,
        date: log.date
      });
      return acc;
    }, {});

    // Format the result as an array of objects with name and data, reversed to have the oldest first
    const result = Object.keys(groupedLogs).map(name => ({
      name,
      data: groupedLogs[name].reverse() // Reverse the data array for each device name
    }));

    return result;
  } catch (error) {
    console.error("Error fetching device logs: ", error);
    throw error;
  }
};

const getAllDeviceTemperatureLog = async (room_id) => {
  try {
    // Fetch logs filtered by room_id, sorted by date in descending order, limit to 12
    const logs = await TempatureLog.find({ room_id }).sort({ date: -1 }).limit(12);
    const result = logs.map(log => ({
      date: log.date,
      data: log.temperature
    })).reverse(); // Reverse the array to have the oldest first

    return result;
  } catch (error) {
    console.error("Error fetching device logs: ", error);
    throw error;
  }
};

const getAllDeviceLightLog = async (room_id) => {
  try {
    // Fetch logs filtered by room_id, sorted by date in descending order, limit to 12
    const logs = await LightLog.find({ room_id }).sort({ date: -1 }).limit(12);
    const result = logs.map(log => ({
      date: log.date,
      data: log.light
    })).reverse(); // Reverse the array to have the oldest first

    return result;
  } catch (error) {
    console.error("Error fetching device logs: ", error);
    throw error;
  }
};

module.exports = { getAllDeviceEnergyLog, getAllDeviceLightLog, getAllDeviceTemperatureLog, getAllDeviceAmperageLog, getAllDeviceVoltageLog };
