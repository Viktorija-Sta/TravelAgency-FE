import { Link, useNavigate, useParams } from "react-router-dom"
import { useCart } from "../../hooks/useCart"
import { useEffect, useState } from "react"
import api from "../../utils/axios"
import { Hotels, Reviews } from "../../types/types"
import ReviewForm from "../Review/ReviewForm"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { toast } from "sonner"
import {
  Box,
  Typography,
  Button,
  Container,
  Rating,
} from "@mui/material"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import "./HotelItem.scss"

const HotelItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [hotel, setHotel] = useState<Hotels | null>(null)
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/hotels/${id}`)
        setHotel(res.data.hotel || res.data)
        setReviews(res.data.reviews || [])
      } catch {
        setError("Nepavyko gauti viešbučio")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const addToCartHandler = () => {
    if (hotel) {
      addToCart({
        _id: hotel._id,
        name: hotel.name,
        price: hotel.pricePerNight,
        image: hotel.image,
        quantity: 1,
        modelType: "Hotel",
      })
      toast.success(`${hotel.name} buvo pridėta į krepšelį`)
    }
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const imageList =
    hotel?.gallery?.length === 1
      ? [hotel.gallery[0], hotel.gallery[0]]
      : hotel?.gallery || []

  const Arrow = ({ direction, onClick }: { direction: "next" | "prev"; onClick?: () => void }) => (
    <div className={`custom-arrow ${direction}`} onClick={onClick}>
      {direction === "next" ? <FiChevronRight /> : <FiChevronLeft />}
    </div>
  )

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <Arrow direction="next" />,
    prevArrow: <Arrow direction="prev" />,
  }

  if (loading) return <div style={{ textAlign: "center" }}>🔄 Kraunama...</div>
  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>
  if (!hotel) return <div style={{ textAlign: "center" }}>Viešbutis nerasta</div>

  return (
    <Container className="detail-page" maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>{hotel.name}</Typography>
      <Link to={`/agencies/${hotel.agency?._id}`}>
        <Typography variant="subtitle1">Agentūra: {hotel.agency?.name || "Nenurodyta"}</Typography>
      </Link>

      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <Rating value={averageRating} precision={0.5} readOnly />
        <Typography sx={{ ml: 1 }}>({reviews.length})</Typography>
        <Button onClick={() => setShowReviews((prev) => !prev)} sx={{ ml: 2 }}>
          {showReviews ? "Slėpti atsiliepimus" : "Rodyti atsiliepimus"}
        </Button>
      </Box>

      {showReviews && (
        <Box sx={{ mt: 3 }}>
          {reviews.length === 0 ? (
            <Typography>Nėra atsiliepimų apie šį viešbutį.</Typography>
          ) : (
            reviews.map((review) => (
              <Box key={review._id} sx={{ borderBottom: "1px solid #ccc", mb: 2, pb: 2 }}>
                <Typography variant="subtitle2">
                  {review.user?.username || "Anonimas"}
                </Typography>
                <Rating value={review.rating} readOnly />
                <Typography>{review.comment}</Typography>
              </Box>
            ))
          )}
          <ReviewForm
            hotelId={hotel._id}
            onReviewSubmitted={(newReview) => setReviews((prev) => [...prev, newReview])}
          />
        </Box>
      )}

      <Typography sx={{ mt: 2 }}>Kategorija: {hotel.category?.name || "Nenurodyta"}</Typography>
      <Typography sx={{ my: 2 }}>{hotel.description}</Typography>

      {hotel.amenities?.length > 0 && (
        <Box sx={{ my: 2 }}>
          <Typography variant="h6">Patogumai:</Typography>
          <ul>
            {hotel.amenities.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </Box>
      )}

      <Typography variant="h6" sx={{ mt: 2 }}>
        Kaina: {hotel.pricePerNight.toFixed(2)} €
      </Typography>

      <Box mt={3}>
        <Slider {...settings}>
          {imageList.map((img, i) => (
            <Box key={i}>
              <img
                src={img}
                alt={`${hotel.name} ${i + 1}`}
                className="carousel-image"
                onError={(e) => { e.currentTarget.src = "/fallback.jpg" }}
                style={{ width: "100%", height: "500px", objectFit: "cover", borderRadius: "8px" }}
              />
            </Box>
          ))}
        </Slider>
      </Box>

      <Button onClick={addToCartHandler} variant="contained" color="primary" sx={{ mb: 3 }}>
        Įdėti į krepšelį
      </Button>

      <Box mt={4} display="flex" gap={2}>
          <Button variant="contained" color="secondary" onClick={() => navigate(-1)}>Grįžti atgal</Button>
        
        
          <Button variant="outlined" onClick={() => navigate("/")}>Į pagrindinį</Button>
        
      </Box>
    </Container>
  )
}

export default HotelItem
