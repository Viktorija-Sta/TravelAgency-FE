import { Outlet } from "react-router-dom"
import NavBar from "../components/NavBar"

function MainLayout() {
  const date = new Date()
  const year = date.getFullYear()


  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }
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
          <p>&copy; {year} Kelionių svetainė</p>
          <p>Visos teisės saugomos</p>
          <p>Pagaminta su 💙</p>
          <button onClick={handleScrollToTop} className="scroll-to-top">Į Viršų</button>
          
         
        </footer>
    </div>
  )
}

export default MainLayout 