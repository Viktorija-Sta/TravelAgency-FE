import { Outlet } from "react-router";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import "./MainLayout.scss";

function MainLayout() {
  return (
    <div className="layout-container">
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