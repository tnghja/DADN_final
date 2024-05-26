const logService = require("../service/LogService");

const getAllDeviceEnergyLog =  async (req, res) => {
    const deviceId = req.params.id;
    try {
      const devices = await logService.getAllDeviceEnergyLog(deviceId);
      console.log(devices)
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  };
  const getAllDeviceAmperageLog =  async (req, res) => {
    const deviceId = req.params.id;
    try {
      const devices = await logService.getAllDeviceAmperageLog(deviceId);
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  }
  const getAllDeviceVoltageLog =  async (req, res) => {
    const deviceId = req.params.id;
    try {
      const devices = await logService.getAllDeviceVoltageLog(deviceId);
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  }

  const getAllDeviceTemperatureLog =  async (req, res) => {
    const roomId = req.params.id;
    try {
      const devices = await logService.getAllDeviceTemperatureLog(roomId);
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  };

  const getAllDeviceLightLog =  async (req, res) => {
    const roomId = req.params.id;
    try {
      const devices = await logService.getAllDeviceLightLog(roomId);
      res.status(200).json(devices);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred while fetching devices' });
    }
  };

  

module.exports = {
  getAllDeviceEnergyLog,
  getAllDeviceAmperageLog,
  getAllDeviceVoltageLog,
  getAllDeviceTemperatureLog,
  getAllDeviceLightLog  
}
  