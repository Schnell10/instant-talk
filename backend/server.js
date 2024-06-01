const http = require('http') //module HTTP inclus dans Node.js
const app = require('./app')
const socketIo = require('socket.io')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const User = require('./models/User.js')
const { v4: uuidv4 } = require('uuid') // librairie pour generer un id unique

//normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
   //On essaie de convertir val en entier base 10
   const port = parseInt(val, 10)
   //Si port est NaN (Not-a-Number), val n'est pas un nombre donc on le retourne tel quel
   if (isNaN(port)) {
      return val
   }
   if (port >= 0) {
      return port
   }
   return false
}

// On configure le serveur pour qu'il écoute sur le port spécifié dans la variable d'environnement ou le port 4000
const port = normalizePort(process.env.PORT || '4000')
app.set('port', port)

//On attrape les différentes erreurs afin de les gèrer de manière appropriée
const errorHandler = (error) => {
   if (error.syscall !== 'listen') {
      throw error
   }
   const address = server.address()
   const bind =
      typeof address === 'string' ? 'pipe ' + address : 'port: ' + port
   switch (
      error.code //On examine le code de l'erreur pour décider de l'action à prendre
   ) {
      case 'EACCES':
         console.error(bind + ' requires elevated privileges.')
         process.exit(1)
         break
      case 'EADDRINUSE':
         console.error(bind + ' is already in use.')
         process.exit(1)
         break
      default:
         throw error
   }
}

//On crée un serveur HTTP qui utilise notre application Express
const server = http.createServer(app)
//On gére les erreurs du serveur
server.on('error', errorHandler)
//On écoute les demandes entrantes sur le port
server.on('listening', () => {
   const address = server.address()
   const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port
   console.log('Listening on ' + bind)
})
// Configuration de Socket.io avec CORS
const io = socketIo(server, {
   cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Authorization'],
      credentials: true,
   },
})

io.on('connection', (socket) => {
   console.log('New client connected')

   // Écoute de l'événement 'sendMessage'
   socket.on('sendMessage', async (data) => {
      try {
         //On récupére le secret token de .env
         const secretToken = process.env.SECRET_TOKEN
         //On décode le token
         const decodedToken = jwt.verify(data.token, secretToken)
         //On extrait l'Id du token
         const userId = decodedToken.userId

         // On utilise l'ID de l'utilisateur pour récupérer les données nécessaires
         const user = await User.findById(userId)

         // Fonction pour générer un identifiant unique
         const generateUniqueId = () => {
            return uuidv4()
         }
         const messageId = generateUniqueId()

         // On créer un objet contenant les données à diffuser avec la date actuelle
         const messageData = {
            _id: messageId,
            message: data.message,
            username: user.username,
            createdAt: new Date(),
            userId: userId,
         }

         // Diffusion du nouveau message à tous les clients connectés avec toutes les données
         io.emit('newMessage', messageData)

         console.log('Message received and broadcasted:', messageData)
      } catch (error) {
         console.error('Error handling sendMessage event:', error)
      }
   })

   // Gestion de la déconnexion d'un client
   socket.on('disconnect', () => {
      console.log('Client disconnected')
   })
})

//On démarre le server en écoutant sur le port configuré
server.listen(port)
