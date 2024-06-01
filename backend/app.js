const express = require('express')
const helmet = require('helmet')

const mongoose = require('mongoose')
const authRoutes = require('./routes/auth')
const messageRoutes = require('./routes/message')

//On récupére le mdp mongoDb du fichier .env
const mongoDbPassword = process.env.mongoDbPassword

//On connecte notre serveur à mongoDB
mongoose
   .connect(mongoDbPassword)
   .then(() => console.log('Connexion à MongoDB réussie !'))
   .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express() //On crée une instance de l'application Express

// Utilisation de Helmet comme middleware  (c'est une librairie JavaScript qui offre un ensemble de fonctions middleware pour renforcer la sécurité en ajoutant des en-têtes HTTP de sécurité)
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

//On gère les en-têtes CORS
app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*') //n'importe quel domaine est autorisé à faire des requêtes vers ce serveur
   res.setHeader(
      //On définit les en-têtes HTTP autorisés dans une requête
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
   )
   res.setHeader(
      // On définit les méthodes HTTP autorisées dans une requête
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS'
   )
   next()
})

// Utilisation d'express.json() au lieu de bodyParser
//(extrait les données JSON de la demande entrante et les rend disponibles dans un format JavaScript)
app.use(express.json())

//routes
app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

module.exports = app
