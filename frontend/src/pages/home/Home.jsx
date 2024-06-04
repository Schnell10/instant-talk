import { useEffect, useState } from 'react'
import ChatForm from '../../components/chatForm/ChatForm'
import Gallery from '../../components/gallery/Gallery'
import './home.scss'
import { Navigate } from 'react-router-dom'
import Members from '../../components/members/Members'

const Home = () => {
   const [galleryIsLoaded, setGalleryIsLoaded] = useState(false)
   // Fonction pour effectuer le scroll vers le bas une fois que Gallery est chargé
   useEffect(() => {
      if (galleryIsLoaded) {
         window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'auto',
         })
         setGalleryIsLoaded(false) // Réinitialise galleryIsLoaded une fois le scroll effectué
      }
   }, [galleryIsLoaded])

   // Vérifiez si le token n'existe pas
   const isTokenMissing = sessionStorage.getItem('token') === null

   // Si le token est manquant, on redirige vers la page de connexion
   return isTokenMissing ? (
      <Navigate to="/login" replace={true} />
   ) : (
      <div className="home-page">
         <Members />
         <div className="gallery-form">
            <Gallery setGalleryIsLoaded={setGalleryIsLoaded} />
            <ChatForm />
         </div>
      </div>
   )
}

export default Home
