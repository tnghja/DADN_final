const express = require('express')
const router = express.Router()

const deviceController = require('../controllers/DeviceController');

router.post('/:id/turnOn', deviceController.turnOn)
router.post('/:id/turnOff', deviceController.turnOff)
router.post('/:id/setFanSpeed', deviceController.setFanSpeed)
module.exports = router