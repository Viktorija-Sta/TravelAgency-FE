import { Link } from "react-router-dom"
import { FaFacebookF, FaInstagram, FaEnvelope } from "react-icons/fa"

import "./Footer.scss"

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Kelionių Portalas. Visos teisės saugomos.</p>
        
        <nav className="footer-links">
          <Link to="/">Pagrindinis</Link>
          <Link to="/destinations">Kelionės</Link>
          <Link to="/hotels">Viešbučiai</Link>
          <Link to="/agencies">Agentūros</Link>
          <Link to="/reviews">Atsiliepimai</Link>
        </nav>

        <div className="social-icons">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          <a href="mailto:info@keliones.lt"><FaEnvelope /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
