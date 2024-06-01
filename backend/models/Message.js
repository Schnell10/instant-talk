const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
   userId: { type: String, required: true },
   username: { type: String, required: true },
   message: { type: String, required: true },
   createdAt: {
      type: Date,
      default: Date.now,
      required: true,
   },
})

module.exports = mongoose.model('Message', messageSchema)
