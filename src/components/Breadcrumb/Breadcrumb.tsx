import { Link, useLocation } from "react-router-dom"
import "./Breadcrumb.scss"

const Breadcrumb: React.FC = () => {
  const location = useLocation()

  const links = [
    { path: "/", label: "Pagrindinis" },
    { path: "/admin", label: "Administratoriaus puslapis" },
    { path: "/admin/metrics", label: "Statistika" },
    { path: "/admin/orders", label: "Užsakymai" },
    { path: "/admin/products", label: "Produktai" },
  ]

  return (
    <nav className="admin-breadcrumbs">
      {links.map(({ path, label }, index) => {
        const isActive = location.pathname === path
        return (
          <span key={path}>
            <Link
              to={path}
              className={isActive ? "breadcrumb-link active" : "breadcrumb-link"}
            >
              {label}
            </Link>
            {index < links.length - 1 && " / "}
          </span>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
