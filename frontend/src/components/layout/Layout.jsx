import React from 'react'
import { useNavigate } from 'react-router-dom'

import './layout.scss'

const Layout = ({ children }) => {
   const token = sessionStorage.getItem('token')
   const navigate = useNavigate()

   const handleLogout = () => {
      sessionStorage.removeItem('token')
      navigate('/login')
   }

   return (
      <div className="app-container">
         <header>
            <h1>Instant Talk</h1>
            {token !== null && <button onClick={handleLogout}>Logout</button>}
         </header>
         <div className="main-content">{children}</div>
         <footer>
            <p>© {new Date().getFullYear()} Pierre Schnell</p>
         </footer>
      </div>
   )
}

export default Layout
