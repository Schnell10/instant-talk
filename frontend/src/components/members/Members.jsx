import React, { useEffect, useState } from 'react'
import './members.scss'

const Members = () => {
   const [members, setMembers] = useState([])

   useEffect(() => {
      const fetchMembers = async () => {
         const token = sessionStorage.getItem('token')
         try {
            const response = await fetch(
               'http://localhost:4000/api/message/users',
               {
                  method: 'GET',
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${token}`,
                  },
               }
            )

            if (response.ok) {
               const data = await response.json()
               setMembers(data.users)
            } else {
               console.error('Erreur lors de la récupération des utilisateurs')
            }
         } catch (error) {
            console.error('Erreur de récupération des utilisateurs:', error)
         }
      }

      fetchMembers()
   }, [])

   return (
      <div className="members">
         <h2>Members</h2>
         <div className="all-members">
            {members.map((member, index) => (
               <p key={index}>{member.username}</p>
            ))}
         </div>
      </div>
   )
}

export default Members
