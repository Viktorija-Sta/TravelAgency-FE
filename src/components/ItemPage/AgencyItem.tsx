import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../../utils/axios"
import { Agencies, Destinations, Hotels, Reviews } from "../../types/types"
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
  Link as MuiLink,
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

  if (loading) return <Typography>Kraunama...</Typography>
  if (error) return <Typography color="error">{error}</Typography>
  if (!agency) return <Typography>Agentūra nerasta</Typography>

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {agency.name}
      </Typography>

      {agency.logo && (
        <Box sx={{ mb: 2 }}>
          <img src={agency.logo} alt={agency.name} style={{ maxWidth: "300px", height: "auto" }} />
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={2}>
        <Rating value={averageRating} precision={0.5} readOnly />
        <Typography variant="body1">({reviews.length} atsiliepimai)</Typography>
        <Button onClick={() => setShowReviews((prev) => !prev)} variant="outlined">
          {showReviews ? "Slėpti" : "Rodyti"} atsiliepimus
        </Button>
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
          <ReviewForm
            agencyId={agency._id}
            onReviewSubmitted={(newReview) => setReviews((prev) => [...prev, newReview])}
          />
        </Box>
      )}

      <Box mt={3}>
        <Typography>{agency.fullDescription}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Kontaktai: {agency.contactInfo?.email}, {agency.contactInfo?.phone}
        </Typography>
        {agency.website && (
          <Typography variant="body2">
            Svetainė:{" "}
            <MuiLink href={agency.website} target="_blank" rel="noopener">
              {agency.website}
            </MuiLink>
          </Typography>
        )}
        {agency.establishedYear && (
          <Typography variant="body2">Įkurta: {agency.establishedYear}</Typography>
        )}
      </Box>

      {destinations.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Kelionės siūlomos šios agentūros:
          </Typography>
          <Grid container spacing={2}>
            {destinations.map((dest) => (
              <Grid key={dest._id} size={{ xs: 12, sm: 6, md: 4, lg: 3}}>
                <DestinationCard
                  destination={dest}
                  averageRating={dest.rating || 0}
                  reviewCount={dest.reviewCount || 0}
                  onAddToCart={() => console.log("Įdėta į krepšelį")}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {hotels.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Viešbučiai siūlomi šios agentūros:
          </Typography>
          <Grid container spacing={2}>
            {hotels.map((hotel) => (
              <Grid key={hotel._id} size={{ xs: 12, sm: 6, md: 4, lg: 3}}>
                <HotelCard
                  hotel={hotel}
                  averageRating={hotel.rating || 0}
                  reviewCount={hotel.reviewsCount || 0}
                  onAddToCart={() => console.log("Įdėta į krepšelį")}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Box mt={4} display="flex" gap={2}>
        <Button onClick={() => navigate(-1)} variant="contained" color="secondary">
          Grįžti atgal
        </Button>
        <Button onClick={() => navigate("/")} variant="outlined">
          Į pagrindinį
        </Button>
      </Box>
    </Container>
  )
}

export default AgencyItem
