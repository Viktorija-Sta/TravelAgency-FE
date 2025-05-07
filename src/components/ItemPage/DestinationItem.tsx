import {
  Box,
  Button,
  Container,
  Divider,
  MenuItem,
  Rating,
  Select,
  Typography,
} from "@mui/material"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useCart } from "../../hooks/useCart"
import { useEffect, useState } from "react"
import { Destinations, Hotels, Reviews } from "../../types/types"
import api from "../../utils/axios"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import ReviewForm from "../Review/ReviewForm"
import { toast } from "sonner"

const DestinationItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [destination, setDestination] = useState<Destinations | null>(null)
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [selectedHotel, setSelectedHotel] = useState<Hotels | null>(null)
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/destinations/${id}`)
        const { destination, hotels, reviews } = res.data
        setHotels(hotels || [])
        setDestination(destination || null)
        setReviews(reviews || [])
      } catch {
        setError("Nepavyko gauti kelionės")
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const addToCartHandler = () => {
    if (!destination) return

    addToCart({
      _id: destination._id,
      name: destination.name,
      price: destination.price,
      image: destination.imageUrl || "",
      quantity: 1,
      modelType: "Destination",
    })

    if (selectedHotel) {
      addToCart({
        _id: selectedHotel._id,
        name: selectedHotel.name,
        price: selectedHotel.pricePerNight * destination.duration,
        image: selectedHotel.image,
        quantity: 1,
        modelType: "Hotel",
      })
    }

    toast.success(`${destination.name} pridėta į krepšelį`, {
      description: selectedHotel ? `Su viešbučiu: ${selectedHotel.name}` : undefined,
    })
  }

  const imageList =
    destination?.gallery?.length === 1
      ? [destination.gallery[0], destination.gallery[0]]
      : destination?.gallery || []

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
  }

  if (loading) return <Typography>🔄 Kraunama...</Typography>
  if (error) return <Typography color="error">{error}</Typography>
  if (!destination) return <Typography>Kelionė nerasta</Typography>

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        {destination.name}
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Rating value={averageRating} precision={0.5} readOnly />
        <Typography>({reviews.length} atsiliepimai)</Typography>
        <Button onClick={() => setShowReviews((prev) => !prev)} size="small">
          {showReviews ? "Slėpti atsiliepimus" : "Rodyti atsiliepimus"}
        </Button>
      </Box>

      <Link to={`/agencies/${destination.agency?._id}`}>
        <Typography color="primary" mt={2}>
          Agentūra: {destination.agency?.name || "Nenurodyta"}
        </Typography>
      </Link>

      {showReviews && (
        <Box mt={3}>
          {reviews.length === 0 ? (
            <Typography>Nėra atsiliepimų apie šią kelionę.</Typography>
          ) : (
            reviews.map((review) => (
              <Box key={review._id} mb={2} p={2} border="1px solid #ccc" borderRadius={2}>
                <Typography fontWeight="bold">{review.user?.username || "Anonimas"}</Typography>
                <Rating value={review.rating} readOnly />
                <Typography>{review.comment}</Typography>
              </Box>
            ))
          )}
          <ReviewForm
            destinationId={destination._id}
            onReviewSubmitted={(newReview) => {
              setReviews((prev) => [...prev, newReview])
            }}
          />
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Typography variant="body1">Kategorija: {destination.category?.name || "Nenurodyta"}</Typography>
      <Typography variant="body2" mt={1}>{destination.description}</Typography>
      <Typography variant="body2" mt={1}>{destination.fullDescription}</Typography>
      <Typography mt={1}>Išvykimo data: {destination.departureDate}</Typography>
      <Typography>Trukmė: {destination.duration} dienos</Typography>
      <Typography fontWeight="bold" mt={1}>
        Kaina: {destination.price.toFixed(2)} €
      </Typography>

      <Box mt={3}>
        <Slider {...settings}>
          {imageList.map((img, i) => (
            <Box key={i}>
              <img
                src={img}
                alt={`${destination.name} ${i + 1}`}
                style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "8px" }}
                onError={(e) => {
                  e.currentTarget.src = "/fallback.jpg"
                }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      {hotels.length > 0 && (
        <Box mt={4} width={"50%"}>
          <Typography variant="h6">Pasirinkite viešbutį (neprivaloma):</Typography>
          <Select
            value={selectedHotel?._id || ""}
            onChange={(e) => {
              const selected = hotels.find((h) => h._id === e.target.value)
              setSelectedHotel(selected || null)
            }}
            fullWidth
            sx={{ mt: 1 }}
          >
            <MenuItem value="">- Be viešbučio -</MenuItem>
            {hotels.map((hotel) => (
              <MenuItem key={hotel._id} value={hotel._id}>
                {hotel.name} (+{(hotel.pricePerNight * destination.duration).toFixed(2)} €)
              </MenuItem>
            ))}
          </Select>

          {selectedHotel && (
            <Box mt={3} p={2} border="1px solid #ccc" borderRadius={2}>
              <Typography variant="h6">{selectedHotel.name}</Typography>
              <Typography>Vieta: {selectedHotel.location}</Typography>
              <Typography>
                Kaina: {selectedHotel.pricePerNight.toFixed(2)} € / naktis x {destination.duration} naktys ={" "}
                {(selectedHotel.pricePerNight * destination.duration).toFixed(2)} €
              </Typography>
              <img
                src={selectedHotel.image}
                alt={selectedHotel.name}
                style={{ width: "100%", maxWidth: "300px", marginTop: "1rem" }}
              />
              <Button variant="outlined" onClick={() => navigate(`/hotels/${selectedHotel._id}`)} sx={{ mt: 1 }}>
                Peržiūrėti viešbutį
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={addToCartHandler}>
          Įdėti į krepšelį
        </Button>
      </Box>

      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>
          Grįžti atgal
        </Button>
        <Button variant="outlined" onClick={() => navigate("/")}>
          Grįžti į pagrindinį meniu
        </Button>
      </Box>
    </Container>
  )
}

export default DestinationItem
