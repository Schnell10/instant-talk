import React, { useState } from 'react'
import './chatForm.scss'
import socketIOClient from 'socket.io-client'

const ChatForm = () => {
   const [message, setMessage] = useState('')

   // Fonction appelée lors de la soumission du formulaire
   const handleSubmit = async (e) => {
      e.preventDefault()
      const token = sessionStorage.getItem('token')
      try {
         if (message.trim() !== '') {
            // Vérifie si le message n'est pas vide après suppression des espaces blancs
            const reponse = await fetch('http://localhost:4000/api/message', {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({ message }),
            })
            if (reponse.ok) {
               // Connexion à Socket.IO en transmettant le token
               const socket = socketIOClient('http://localhost:4000')
               socket.emit('sendMessage', { message, token })
               setMessage('')
            } else {
               console.log('error, msg not add to database')
            }
         }
      } catch (error) {
         console.error('Error sending request:', error)
      }
   }

   return (
      <form className="chat-form" onSubmit={handleSubmit}>
         <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message..."
         />
         <button type="submit">Send</button>
      </form>
   )
}

export default ChatForm
