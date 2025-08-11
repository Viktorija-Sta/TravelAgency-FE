import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../utils/axios"
import type { Agencies, Destinations, Hotels, Reviews } from "../../types/types"
import DestinationCard from "../Card/DestinationCard"
import HotelCard from "../Card/HotelCard"
import ReviewForm from "../Review/ReviewForm"
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  Divider,
  Rating,
  CircularProgress,
} from "@mui/material"

const AgencyItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [agency, setAgency] = useState<Agencies | null>(null)
  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        const res = await api.get(`/agencies/${id}`)
        const { agency, destinations, hotels, reviews } = res.data

        setAgency(agency)
        setDestinations(destinations)
        setHotels(hotels)
        setReviews(reviews)
      } catch (err) {
        console.error("Klaida gaunant agentūros duomenis:", err)
        setError("Nepavyko gauti agentūros informacijos")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchAgencyData()
  }, [id])

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  if (loading) return (
    <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
    </Container>
  )
  if (error) return <Typography color="error">{error}</Typography>
  if (!agency) return <Typography>Agentūra nerasta</Typography>

  return (
    <Container sx={{ m: 4 }}>
      <Typography variant="h4" gutterBottom>{agency.name}</Typography>

      {agency.logo && (
        <Box sx={{ display: "flex", justifyContent: "start", mb: 2 }}>

          <img src={agency.logo} alt={agency.name} style={{ maxWidth: "30%", height: "auto", objectFit: "contain" }} />
          
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={2} sx={{ flexDirection: { xs: "column", sm: "row" } }}>

        <Rating value={averageRating} precision={0.5} readOnly />
        <Typography variant="body1">({reviews.length} atsiliepimai)</Typography>
        <Button onClick={() => setShowReviews((prev) => !prev)} variant="outlined" size="small">{showReviews ? "Slėpti" : "Rodyti"} atsiliepimus</Button>

      </Box>

      {showReviews && (
        <Box mt={3}>
          <Divider sx={{ mb: 2 }} />
          {reviews.length === 0 ? (
            <Typography>Nėra atsiliepimų apie šią agentūrą.</Typography>
          ) : (
            reviews.map((review) => (
              <Box key={review._id} sx={{ mb: 2 }}>
                <Typography fontWeight="bold">{review.user?.username || "Anonimas"}</Typography>
                <Rating value={review.rating} readOnly />
                <Typography>{review.comment}</Typography>
              </Box>
            ))
          )}
          <ReviewForm agencyId={agency._id} onReviewSubmitted={(newReview) => setReviews((prev) => [...prev, newReview])} />
        </Box>
      )}

      {destinations.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Kelionės:</Typography>
          <Grid container spacing={2}>
            {destinations.map((dest) => (
              <Grid key={dest._id} size={{ xs: 10, sm: 6, md: 4, lg: 3 }}>
                <DestinationCard destination={dest} averageRating={dest.rating || 0} reviewCount={dest.reviewCount || 0} onAddToCart={() => {}} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {hotels.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Viešbučiai:</Typography>
          <Grid container spacing={2}>
            {hotels.map((hotel) => (
              <Grid key={hotel._id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }} >
                <HotelCard hotel={hotel} averageRating={hotel.rating || 0} reviewCount={hotel.reviewsCount || 0} onAddToCart={() => {}} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box mt={2} display="flex" flexWrap="wrap" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="secondary"  
          sx={{ m: 2 }} 
          onClick={() => navigate(-1)}>
          Grįžti atgal
        </Button>
        
        <Button 
            variant="outlined" 
            onClick={() => navigate('/')}
            color="inherit"
            sx={{ m: 2 }}>
            Grįžti į pagrindinį puslapį
        </Button>
            
      </Box>
    </Container>
  )
}
export default AgencyItem
