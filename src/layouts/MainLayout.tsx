import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"

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
           
        </footer>
    </div>
  )
}

export default MainLayout 