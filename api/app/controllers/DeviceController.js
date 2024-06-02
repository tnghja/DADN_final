const {turnOnDevice, turnOffDevice, updateFanSpeed} = require('../service/DeviceService');

const turnOn = async (req, res) => {
  const feedKey = req.params.id;
  try {
    const data = await turnOnDevice(feedKey);
    res.status(200).json({ message: 'Thiết bị đã bật', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi bật thiết bị', error: error.message });
  }
};

const turnOff = async (req, res) => {
  const feedKey = req.params.id;
  try {
    const data = await turnOffDevice(feedKey);
    res.status(200).json({ message: 'Thiết bị đã tắt', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tắt thiết bị', error: error.message });
  }
};

const setFanSpeed = async (req, res) => {
  const  deviceId = req.params.id;
  const  value  = req.body.value;
  try {
    const data = await updateFanSpeed(deviceId,value);
    res.status(200).json({ message: 'Thiết bị đã tắt', data });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tắt thiết bị', error: error.message });
  }
}
module.exports = {
  turnOn,
  turnOff,
  setFanSpeed
};
