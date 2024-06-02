const express = require('express')
const router = express.Router()

const roomController = require('../controllers/RoomController');

router.get('/:id', roomController.getAllDevices)
router.get('/:id/event', roomController.getAllEvents)
router.post('/:id/schedule/:scheduleId', roomController.scheduleEvent)
router.post('/:id/threshold', roomController.setThreshold)
router.get('/:id/threshold', roomController.getThreshold)
module.exports = router

