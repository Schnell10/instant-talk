import React, { useEffect, useState } from 'react'
import './gallery.scss'
import socketIOClient from 'socket.io-client'

const Gallery = () => {
   const [messages, setMessages] = useState([])
   const [userId, setUserId] = useState('')

   const getAllMessages = async () => {
      const token = sessionStorage.getItem('token')
      try {
         const reponse = await fetch('http://localhost:4000/api/message', {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${token}`,
            },
         })

         if (reponse.ok) {
            const data = await reponse.json()

            const messages = data.messages
            const userId = data.userId

            //On formate la date dans chaque message
            const formattedData = messages.map((message) => {
               if (message.createdAt) {
                  const messageDate = new Date(message.createdAt)
                  const currentDate = new Date()

                  // Vérifie si la date de création est le même jour que la date actuelle
                  const isToday =
                     messageDate.getDate() === currentDate.getDate() &&
                     messageDate.getMonth() === currentDate.getMonth() &&
                     messageDate.getFullYear() === currentDate.getFullYear()

                  // Vérifie si l'année de création est différente de l'année actuelle
                  const isDifferentYear =
                     messageDate.getFullYear() !== currentDate.getFullYear()

                  let formattedCreatedAt

                  if (isToday) {
                     // Si le message a été créé aujourd'hui, affichez seulement l'heure
                     formattedCreatedAt = messageDate.toLocaleTimeString(
                        'fr-FR',
                        {
                           hour: '2-digit',
                           minute: '2-digit',
                           hour12: false,
                        }
                     )
                  } else {
                     // Sinon, affichez la date et l'heure complètes
                     if (isDifferentYear) {
                        formattedCreatedAt = messageDate.toLocaleString(
                           'fr-FR',
                           {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                           }
                        )
                     } else {
                        formattedCreatedAt = messageDate.toLocaleString(
                           'fr-FR',
                           {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false,
                           }
                        )
                     }
                  }

                  // Remplacez la date de création par la date et l'heure formatées
                  return { ...message, createdAt: formattedCreatedAt }
               } else {
                  // Si le message n'a pas de date de création, retournez-le tel quel
                  return message
               }
            })
            setMessages(formattedData)
            setUserId(userId)
         }
      } catch (error) {
         console.error('Erreur de récupération des données:', error)
      }
   }
   useEffect(() => {
      getAllMessages()
   }, [])

   useEffect(() => {
      console.log('Attempting to establish connection with Socket.io server...')
      const socket = socketIOClient('http://localhost:4000')

      socket.on('connect', () => {
         console.log('Connected to Socket.io server')
      })

      socket.on('newMessage', (message) => {
         console.log('Received new message:', message)
         //On formate la date dans chaque message
         const formattedCreatedAt = new Date(message.createdAt).toLocaleString(
            'en-CA',
            {
               hour: '2-digit',
               minute: '2-digit',
               hour12: false,
            }
         )
         // On met à jour le message avec la date formatée
         const formattedMessage = { ...message, createdAt: formattedCreatedAt }

         setMessages((prevMessages) => [...prevMessages, formattedMessage])
      })

      return () => {
         socket.disconnect()
         console.log('Disconnected from Socket.io server')
      }
   }, [])

   return (
      <div className="gallery">
         {messages.map((message) => (
            <div
               className={
                  userId === message.userId ? 'my-message' : 'other-message'
               }
               key={message._id}
            >
               <p>{message.message}</p>
               <p>{message.createdAt}</p>
               <p>{message.username}</p>
            </div>
         ))}
      </div>
   )
}

export default Gallery
