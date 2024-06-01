import ChatForm from '../../components/chatForm/ChatForm'
import Gallery from '../../components/gallery/Gallery'
import './home.scss'
import { Navigate } from 'react-router-dom'

const Home = () => {
   // Vérifiez si le token n'existe pas
   const isTokenMissing = sessionStorage.getItem('token') === null

   // Si le token est manquant, redirigez vers la page de connexion
   return isTokenMissing ? (
      <Navigate to="/login" replace={true} />
   ) : (
      // Affichez la liste des messages si le token est présent
      <div className="home-page">
         <Gallery />
         <ChatForm />
      </div>
   )
}

export default Home
