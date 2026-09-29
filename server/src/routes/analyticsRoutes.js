const express = require('express')
const { overview } = require('../controllers/analyticsController')

const router = express.Router()

router.get('/', overview)

module.exports = router
