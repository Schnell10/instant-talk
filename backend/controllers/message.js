const Message = require('../models/Message.js')
const User = require('../models/User.js')

exports.createMessage = async (req, res, next) => {
   try {
      const messageObject = req.body
      delete messageObject.userId
      // Récupérer l'utilisateur associé à l'ID de l'auteur du message
      const user = await User.findById(req.auth.userId)

      const message = new Message({
         ...messageObject,
         userId: req.auth.userId,
         username: user.username,
      })

      message
         .save()
         .then(() =>
            res
               .status(201)
               .json({ message: 'Message enregistrée avec succès !' })
         )
         .catch((error) => {
            res.status(400).json({
               message: 'Erreur lors de la création du message',
               error: error.message,
            })
         })
   } catch (error) {
      res.status(500).json({
         message: 'Erreur serveur',
         error: error.message,
      })
   }
}

exports.getAllMessages = (req, res, next) => {
   const userId = req.auth.userId
   Message.find()
      .then((messages) =>
         res.status(200).json({ messages: messages, userId: userId })
      )
      .catch((error) => res.status(400).json({ error }))
}

exports.deleteMessage = async (req, res, next) => {
   try {
      const message = await Message.findOne({ _id: req.params.id })

      if (!message) {
         return res.status(404).json({ message: 'Message non trouvée' })
      }

      if (message.userId != req.auth.userId) {
         return res.status(403).json({ message: 'Unauthorized user' })
      }

      await message.deleteOne({ _id: req.params.id })
      return res.status(200).json({ message: 'Message supprimée !' })
   } catch (error) {
      console.error('Error deleting message:', error)
      return res.status(500).json({ error })
   }
}
