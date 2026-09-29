const express = require('express')
const { getAll, create } = require('../controllers/matchController')

const router = express.Router()

router.get('/', getAll)
router.post('/', create)

module.exports = router
