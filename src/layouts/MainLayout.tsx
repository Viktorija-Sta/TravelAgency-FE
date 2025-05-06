import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar/NavBar"
import Footer from "../components/Footer/Footer"
import "./MainLayout.scss"

function MainLayout() {
 
  return (
    <div>
      <header>
        <nav>
          <h1>Kelionių svetainė</h1>
          <NavBar />
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
        <footer>
         <Footer />
          
         
        </footer>
    </div>
  )
}

export default MainLayout 