import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import "./NavBar.scss"
import { useState } from "react"
import MenuIcon from "@mui/icons-material/Menu"
import { Drawer, IconButton, List, ListItem, Box, } from "@mui/material"

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const logoutHandler = () => {
    logout()
    navigate("/login")
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawerContent = (
    <Box
      sx={{
        width: 250,
        paddingTop: 4,
        textAlign: "center",
      }}
      role="presentation"
      onClick={handleDrawerToggle}
    >
      <List>
        <ListItem>
          <NavLink to="/">Pagrindis</NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/destinations">Kelionų kryptys</NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/hotels">Viešbučiai</NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/agencies">Agentūros</NavLink>
        </ListItem>
        <ListItem>
          <NavLink to="/reviews">Atsiliepimai</NavLink>
        </ListItem>

        {isAuthenticated && (
          <>
            <ListItem>
              <NavLink to="/profile">Profilis</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="/cart">Krepšelis</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="/my-orders">Užsakymai</NavLink>
            </ListItem>
            {user?.role?.toLowerCase() === "admin" && (
              <ListItem>
                <NavLink to="/admin">Administravimas</NavLink>
              </ListItem>
            )}
            <ListItem>
              <button className="logout-button" onClick={logoutHandler}>
                Atsijungti
              </button>
            </ListItem>
          </>
        )}

        {!isAuthenticated && (
          <>
            <ListItem>
              <NavLink to="/login">Prisijungti</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="/register">Prisiregistruoti</NavLink>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  )

  return (
    <>
      <nav className="navbar">
        <div className="mobile-menu-icon">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon style={{ color: "white" }} />
          </IconButton>
        </div>
        <ul className="desktop-menu">
          <li>
            <NavLink to="/">Pagrindis</NavLink>
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
          <li>
            <NavLink to="/reviews">Atsiliepimai</NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/profile">Profilis</NavLink>
              </li>
              <li>
                <NavLink to="/cart">Krepšelis</NavLink>
              </li>
              <li>
                <NavLink to="/my-orders">Užsakymai</NavLink>
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

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{ display: { sm: "none" } }}
      >
        {drawerContent}
      </Drawer>
    </>
  )
}

export default NavBar
