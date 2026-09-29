const express = require('express')
const { create, getAll, getOne, update } = require('../controllers/requestController')

const router = express.Router()

router.post('/', create)
router.get('/', getAll)
router.get('/:id', getOne)
router.put('/:id', update)

module.exports = router
