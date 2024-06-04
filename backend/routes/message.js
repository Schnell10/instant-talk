const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const messageControllers = require('../controllers/message')

router.post('/', auth, messageControllers.createMessage)

router.get('/', auth, messageControllers.getAllMessages)
router.get('/users', messageControllers.getAllUsers)

module.exports = router
