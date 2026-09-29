const express = require('express')
const { createDelivery, getAll, updateStatus } = require('../controllers/deliveryController')

const router = express.Router()

router.post('/', createDelivery)
router.get('/', getAll)
router.put('/:id/status', updateStatus)

module.exports = router
