import { Link } from "react-router-dom"
import { Container, Typography, Button, Box } from "@mui/material"
import "./OrderSuccessPage.scss"

const OrderSuccessPage: React.FC = () => {
    return (
        <Container 
            maxWidth="sm" 
            sx={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center", 
                minHeight: "80vh", 
                textAlign: "center" 
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Ačiū! Užsakymas gautas
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Jūsų užsakymas buvo sėkmingai pateiktas.
                </Typography>
            </Box>

            <Box sx={{ display: "flex", gap: 2 }}>
                <Button 
                    component={Link} 
                    to="/my-orders" 
                    variant="contained" 
                    color="primary"
                    sx={{ textTransform: "none" }}
                >
                    Peržiūrėti užsakymus
                </Button>
                <Button 
                    component={Link} 
                    to="/" 
                    variant="outlined" 
                    color="secondary"
                    sx={{ textTransform: "none" }}
                >
                    Grįžti į pradžią
                </Button>
            </Box>
        </Container>
    )
}

export default OrderSuccessPage
