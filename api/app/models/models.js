const mongoose = require("mongoose");

const AccountSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const AreaSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const RoomSchema = new mongoose.Schema({
  room_id: { type: String, required: true },
  area_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
});

const DeviceSchema = new mongoose.Schema({
  device_id : { type: String, required: true },
  type: { type: String, required: true },
  deviceName: { type: String, required: true },
  room_id: { type: String, ref: 'Room' },
  status: { type: Boolean, default: false },
});

const EnergyLogSchema = new mongoose.Schema({
  power: Number,
  date: { type: Date, default: Date.now },
  time: { type: String, required: true },
  room_id: { type: String, ref: 'Room' },
  device_id: { type: String, ref: 'Device' },
});

const TemperatureLogSchema = new mongoose.Schema({
  temperature: Number,
  date: { type: Date, default: Date.now },
  time: { type: String, required: true },
  room_id: { type: String, ref: 'Room' },
  device_id: { type: String, ref: 'Device' },
});

const LightLogSchema = new mongoose.Schema({
  light: Number,
  date: { type: Date, default: Date.now },
  time: { type: String, required: true },
  room_id: { type: String, ref: 'Room' },
  device_id: { type: String, ref: 'Device' },
});

const calendarSchema = new mongoose.Schema({
  id: Number,
  title: String,
  room: String,
  building: String,
  startTime : Date,
  endTime : Date
})

const AmperageLogSchema = new mongoose.Schema({
  amperage: Number,
  date: { type: Date, default: Date.now },
  room_id: { type: String, ref: 'Room' },
  device_id: { type: String, ref: 'Device' },
});

const VoltageLogSchema = new mongoose.Schema({
  voltage: Number,
  date: { type: Date, default: Date.now },
  room_id: { type: String, ref: 'Room' },
  device_id: { type: String, ref: 'Device' },
});


const Account = mongoose.model("Account", AccountSchema);
const Device = mongoose.model("Device", DeviceSchema);
const Room = mongoose.model("Room", RoomSchema);
const Area = mongoose.model("Area", AreaSchema);
const LightLog = mongoose.model("LightLog", LightLogSchema);
const EnergyLog = mongoose.model("EnergyLog", EnergyLogSchema);
const AmperageLog = mongoose.model("AmperageLog", AmperageLogSchema);
const VoltageLog = mongoose.model("VoltageLog", VoltageLogSchema);
const TempatureLog = mongoose.model("TempatureLog", TemperatureLogSchema);
const Calendar = mongoose.model("Calendar", calendarSchema);
module.exports = {
  Account,
  Device,
  Room,
  Area,
  LightLog,
  EnergyLog,
  TempatureLog,
  Calendar,
  AmperageLog,
  VoltageLog
};
