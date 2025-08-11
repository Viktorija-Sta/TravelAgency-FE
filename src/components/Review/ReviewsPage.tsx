import { useEffect, useState } from "react"
import type { Reviews } from "../../types/types"
import { Link } from "react-router-dom"
import api from "../../utils/axios"
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Grid,
  FormControl,
  InputLabel
} from "@mui/material"
import Rating from "@mui/material/Rating"

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<"all" | "hotels" | "destinations" | "agencies">("all")

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/reviews")
        setReviews(response.data)
      } catch {
        setError("Nepavyko gauti atsiliepimų")
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const filteredReviews = reviews.filter((review) => {
    if (filter === "hotels") return !!review.hotel
    if (filter === "destinations") return !!review.destination
    if (filter === "agencies") return !!review.agency
    return true
  })

  if (loading) return (
    <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
    </Container>
  )

  if (error) return (
    <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
      <Alert severity="error">{error}</Alert>
    </Container>
  )

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>Atsiliepimai</Typography>

      <FormControl fullWidth sx={{ marginBottom: 2 }}>
        <InputLabel>Filtruoti pagal</InputLabel>
        <Select
          value={filter}
          label="Filtruoti pagal"
          onChange={(e) =>
            setFilter(e.target.value as "all" | "hotels" | "destinations" | "agencies")
          }
        >
          <MenuItem value="all">Visi</MenuItem>
          <MenuItem value="hotels">Viešbučiai</MenuItem>
          <MenuItem value="destinations">Kelionių kryptys</MenuItem>
          <MenuItem value="agencies">Agentūros</MenuItem>
        </Select>
      </FormControl>

      {filteredReviews.length === 0 ? (
        <Typography variant="body1" color="text.secondary">Atsiliepimų nėra.</Typography>
      ) : (
        <Grid container spacing={2} direction="column">
          {filteredReviews.map((review) => (
            <Grid key={review._id} size={{xs: 12}} >
              <Card variant="outlined" sx={{ marginBottom: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{review.user.username}</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{review.comment}</Typography>
                  <Rating value={review.rating} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary">({review.rating})</Typography>
                  {review.destination && typeof review.destination !== "string" && (
                    <Typography variant="body2">
                      Kelionė: <Link to={`/destinations/${review.destination._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>{review.destination.name}</Link>
                    </Typography>
                  )}
                  {review.hotel && typeof review.hotel !== "string" && (
                    <Typography variant="body2">
                      Viešbutis: <Link to={`/hotels/${review.hotel._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>{review.hotel.name}</Link>
                    </Typography>
                  )}
                  {review.agency && typeof review.agency !== "string" && (
                    <Typography variant="body2">
                      Agentūra: <Link to={`/agencies/${review.agency._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>{review.agency.name}</Link>
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default ReviewsPage
