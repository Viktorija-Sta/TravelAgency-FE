import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"
import Footer from "../components/Footer/Footer"

function MainLayout() {
 
  return (
    <div>
      <header>
          <h1>Kelionių svetainė</h1>
        <nav>
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