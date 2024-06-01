import React, { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import './login.scss'

const Login = () => {
   // State pour gérer l'affichage du formulaire de création de compte
   const [showCreateAccount, setShowCreateAccount] = useState(false)

   // State pour stocker l'email et le mot de passe saisis par l'utilisateur
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [username, setUsername] = useState('')

   // State pour gérer les messages d'erreur
   const [error, setError] = useState('')
   // Initialiser le hook `useNavigate`
   const navigate = useNavigate()

   // Fonction pour basculer entre le formulaire de connexion et de création de compte
   const toggleCreateAccount = () => {
      setShowCreateAccount(!showCreateAccount)
      setError('')
   }

   // Fonction pour traiter la soumission du formulaire (connexion)
   const handleSubmit = async (event) => {
      event.preventDefault()

      try {
         // Appel API pour la connexion
         const response = await fetch('http://localhost:4000/api/auth/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               username,
               password,
            }),
         })

         // Vérifier si la réponse est OK
         if (!response.ok) {
            const errorData = await response.json()
            const errorMessage =
               errorData.message || 'An error occurred. Please try again later.'
            setError(errorMessage)
            return
         }

         // Traitement de la réponse
         const data = await response.json()
         if (!data.token) {
            setError('Invalid username or password. Please try again.')
            return // Arrêter ici si les identifiants sont incorrects
         }

         sessionStorage.setItem('token', data.token)
         navigate('/')
      } catch (error) {
         setError('An error occurred. Please try again later.')
      }
   }

   // Fonction pour traiter la soumission du formulaire de création de compte
   const handleCreateAccount = async (event) => {
      event.preventDefault()

      try {
         // Appel API pour la création de compte
         const response = await fetch('http://localhost:4000/api/auth/signup', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               email,
               username,
               password,
            }),
         })

         // Vérifier si la réponse est OK
         if (!response.ok) {
            const errorData = await response.json()
            setError(
               errorData.message || 'An error occurred. Please try again later.'
            )
            return
         }
         const data = await response.json()
         if (!data.token) {
            setError('problem met at inscription')
            return // Arrêter ici
         }

         sessionStorage.setItem('token', data.token)
         navigate('/')

         console.log('compte ajouté avec succès')
         setError('')
      } catch (error) {
         setError('An error occurred. Please try again later.')
         console.error('Error:', error.message)
      }
   }

   const resetError = () => {
      setError('')
   }

   // Si le token existe, redirigez vers la page home
   const token = sessionStorage.getItem('token')
   if (token !== null) {
      return <Navigate to="/" replace={true} />
   }

   // Rendu du composant
   return (
      <div className="login-page">
         {/* Titre dynamique en fonction du formulaire actuellement affiché */}
         <h2>{showCreateAccount ? 'Create an Account' : 'Login'}</h2>

         {/* Formulaire de connexion ou de création de compte */}
         <form
            onSubmit={showCreateAccount ? handleCreateAccount : handleSubmit}
         >
            {showCreateAccount && (
               <label>
                  Email:
                  {/* Champ de saisie pour l'email avec gestion de l'état */}
                  <input
                     type="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     onClick={resetError}
                  />
               </label>
            )}
            <label>
               Username:
               {/* Champ de saisie pour le nom utilisateur avec gestion de l'état */}
               <input
                  type="text"
                  placeholder="Enter your user name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onClick={resetError}
               />
            </label>
            <label>
               Password:
               {/* Champ de saisie pour le mot de passe avec gestion de l'état */}
               <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onClick={resetError}
               />
            </label>
            {/* Bouton pour soumettre le formulaire (connexion ou création de compte) */}
            <button
               type="submit"
               disabled={
                  (showCreateAccount &&
                     (!email ||
                        !password ||
                        password.length < 8 ||
                        !username)) ||
                  (!showCreateAccount &&
                     (!username || !password || password.length < 8))
               }
            >
               {showCreateAccount ? 'Create Account' : 'Login'}
            </button>
         </form>

         {/* Afficher le message d'erreur s'il y en a un */}
         {error && <p className="error-message">{error}</p>}

         {/* Bouton pour afficher/cacher le formulaire de création de compte */}
         <button className="create-account" onClick={toggleCreateAccount}>
            {showCreateAccount ? 'Back to Login' : 'Create an Account'}
         </button>
      </div>
   )
}

export default Login
