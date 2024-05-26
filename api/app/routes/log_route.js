const express = require('express')
const router = express.Router()

const logController = require('../controllers/LogController');

router.get('/:id', logController.getAllDeviceEnergyLog)
router.get('/:id/temperature', logController.getAllDeviceTemperatureLog)
router.get('/:id/light', logController.getAllDeviceLightLog)
router.get('/:id/amperage', logController.getAllDeviceAmperageLog)
router.get('/:id/voltage', logController.getAllDeviceVoltageLog)
module.exports = router

