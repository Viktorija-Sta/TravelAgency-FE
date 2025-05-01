import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()

  const navigate = useNavigate()

  const logoutHandler = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/destinations">Kelionų kryptys</NavLink>
        </li>
        <li>
          <NavLink to="/hotels">Viešbučiai</NavLink>
        </li>
        <li>
          <NavLink to="/agencies">Agentūros</NavLink>
        </li>

        {isAuthenticated && (
          <>
            <li>
              <NavLink to="/profile">Profilis</NavLink>
            </li>
            <li>
              <NavLink to="/my-orders">Užsakymai</NavLink>
            </li>
            <li>
              <NavLink to="/cart">Krepšelis</NavLink>
            </li>

            {user?.role?.toLowerCase() === "admin" && (
              <li>
                <NavLink to="/admin">Administravimas</NavLink>
              </li>
            )}
            <li>
              <button className="logout-button" onClick={logoutHandler}>
                Atsijungti
              </button>
            </li>
          </>
        )}

        {!isAuthenticated && (
          <>
            <li>
              <NavLink to="/login">Prisijungti</NavLink>
            </li>
            <li>
              <NavLink to="/register">Prisiregistruoti</NavLink>
            </li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default NavBar
