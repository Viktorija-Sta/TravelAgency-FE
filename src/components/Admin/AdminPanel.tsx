import { Link, useNavigate } from "react-router"
import { 
    Container, Typography, Button, Grid, Box, Paper 
} from "@mui/material"

const AdminPanel: React.FC = () => {
    const navigate = useNavigate()

    return (
        <Container maxWidth="sm" sx={{ m: 10, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom>Administravimo puslapis</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', m: 10 }}>
                <Grid container spacing={2} justifyContent="center">
                    <Grid size={{xs: 12}}>
                        <Paper elevation={3} >
                            <Button 
                                component={Link} 
                                to="/admin/products" 
                                variant="contained" 
                                fullWidth
                                sx={{ height: 60 }}
                            >
                                Valdyti duomenis
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid size={{xs: 12}}>
                        <Paper elevation={3} >
                            <Button 
                                component={Link} 
                                to="/admin/orders" 
                                variant="contained" 
                                color="primary" 
                                fullWidth
                                sx={{ height: 60 }}
                            >
                                Valdyti užsakymus
                            </Button>
                        </Paper>
                    </Grid>
                    <Grid  size={{xs: 12}}>
                        <Paper elevation={3} >
                            <Button 
                                component={Link} 
                                to="/admin/metrics" 
                                variant="contained" 
                                color="secondary" 
                                fullWidth
                                sx={{ height: 60 }}
                            >
                                Užsakymų statistika
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate('/')}
                    color="inherit"
                    sx={{ mt: 2 }}
                >
                    Grįžti į pagrindinį puslapį
                </Button>
            </Box>
        </Container>
    )
}

export default AdminPanel
