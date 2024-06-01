const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const messageControllers = require('../controllers/message')

router.post('/', auth, messageControllers.createMessage)

router.get('/', auth, messageControllers.getAllMessages)

router.delete('/:id', auth, messageControllers.deleteMessage)

module.exports = router
