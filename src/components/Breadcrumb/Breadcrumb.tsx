import { Link as RouterLink, useLocation } from "react-router-dom"
import { Breadcrumbs, Link, Typography, Box } from "@mui/material"

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
    <Box 
      sx={{ 
        display: "flex", 
        justifyContent: "center", 
        marginBottom: 2, 
        padding: "8px 0", 
        backgroundColor: "transparent", 
        color: "#ccc",
        textAlign: "center"
      }}
    >
      <Breadcrumbs 
        aria-label="breadcrumb"
        sx={{
          backgroundColor: "transparent",
          padding: "8px 16px",
          borderRadius: "4px",
        }}
      >
        {links.map(({ path, label }) => {
          const isActive = location.pathname === path

          return isActive ? (
            <Typography 
              key={path} 
              color="text.primary" 
              sx={{ fontWeight: "bold", color: "white" }}
            >
              {label}
            </Typography>
          ) : (
            <Link
              key={path}
              component={RouterLink}
              to={path}
              underline="hover"
              sx={{ 
                color: "#1976d2", 
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {label}
            </Link>
          )
        })}
      </Breadcrumbs>
    </Box>
  )
}

export default Breadcrumb
