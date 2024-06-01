const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
require('dotenv').config()

exports.signup = async (req, res, next) => {
   try {
      const { email, password, username } = req.body

      console.log('Signup request received:', { email, username })

      // Vérifiez si un utilisateur avec le même email existe déjà
      const existingEmailUser = await User.findOne({ email })
      if (existingEmailUser) {
         return res.status(401).json({ message: 'Email already exists' })
      }

      // Vérifiez si un utilisateur avec le même nom d'utilisateur existe déjà
      const existingUsernameUser = await User.findOne({ username })
      if (existingUsernameUser) {
         return res.status(401).json({ message: 'Username already exists' })
      }

      // Hachage du mot de passe
      const hash = await bcrypt.hash(password, 10)
      console.log('Password hashed successfully')

      // Création d'une nouvelle instance de modèle utilisateur
      const user = new User({
         email,
         password: hash,
         username,
      })

      // Enregistrement de l'utilisateur dans la base de données
      await user.save()
      console.log('User saved successfully:', user)

      // Génération du token JWT après la création du compte
      const secretToken = process.env.SECRET_TOKEN
      if (!secretToken) {
         throw new Error('Secret token not defined in environment variables')
      }

      const token = jwt.sign({ userId: user._id }, secretToken, {
         expiresIn: '24h',
      })
      console.log('Token generated successfully:', token)

      res.status(201).json({ message: 'User created successfully!', token })
   } catch (error) {
      console.error('Error during signup process:', error)
      res.status(400).json({ message: 'Error registering user', error })
   }
}
exports.login = (req, res, next) => {
   //On récupére le secret token de .env
   const secretToken = process.env.SECRET_TOKEN

   // Recherche de l'utilisateur dans la base de données par son adresse e-mail
   User.findOne({ username: req.body.username })
      .then((user) => {
         //Si aucun utilisateur correspond on renvoit le msg d'erreur
         if (!user) {
            return res
               .status(401)
               .json({ message: '"username not found in the database"' })
         }
         //On se sert de bcrypt pour comparer le mdp de la requête avec le mdp hashé dans la base de donnée
         bcrypt
            .compare(req.body.password, user.password)
            .then((valid) => {
               if (!valid) {
                  return res.status(401).json({ message: 'Incorrect password' })
               }
               res.status(200).json({
                  //On renvoit l'identifiant de l'utilisateur et le JWT
                  userId: user._id,
                  //On remplie le jwt avec l'userId, le secretToken
                  token: jwt.sign({ userId: user._id }, secretToken, {
                     expiresIn: '24h',
                  }),
               })
            })
            .catch((error) => res.status(500).json({ error }))
      })
      .catch((error) => res.status(500).json({ error }))
}
