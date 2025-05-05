import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import { useEffect, useState } from "react"
import { Destinations, Hotels, Reviews } from "../types/types"
import api from "../utils/axios"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import "./DestinationItem.scss"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import HotelCard from "../components/Card/HotelCard"
import ReviewForm from "../Review/ReviewForm"

const DestinationItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [destination, setDestination] = useState<Destinations | null>(null)
  const [hotels, setHotels] = useState<Hotels[]>([])
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
        setDestination(destination || [])
        setReviews(reviews || []) 
      } catch {
        setError("Nepavyko gauti kelionės")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const addToCartHandler = () => {
    if (destination) {
      addToCart({
        _id: destination._id,
        name: destination.name,
        price: destination.price,
        image: destination.imageUrl || "",
        quantity: 1,
        
      })
      alert(`${destination.name} buvo pridėta į krepšelį`)
    }
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating)
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars)
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const imageList =
    destination?.gallery?.length === 1
      ? [destination.gallery[0], destination.gallery[0]]
      : destination?.gallery || []

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

  if (loading) return <div>🔄 Kraunama...</div>
  if (error) return <div>{error}</div>
  if (!destination) return <div>Kelionė nerasta</div>

  return (
    <div className="detail-page">
      <h1>{destination.name}</h1>
      <p>
        Įvertinimas: {renderStars(averageRating)} ({reviews.length}){" "}
        <button onClick={() => setShowReviews((prev) => !prev)} >
          {showReviews ? "Slėpti atsiliepimus" : "Rodyti atsiliepimus"}
        </button>
      </p>

      {showReviews && (
        <div className="reviews-section">
          {reviews.length === 0 ? (
            <p>Nėra atsiliepimų apie šią kelionę.</p>
          ) : (
            <>
              {reviews.map((review) => (
                <div key={review._id} className="review-card">
                  <p className="font-semibold">{review.user?.username || "Anonimas"}</p>
                  <p>{renderStars(review.rating)}</p>
                  <p>{review.comment}</p>
                </div>
              ))}
              <ReviewForm 
                 destinationId={destination._id}
                 onReviewSubmitted={(newReview) => {
                   setReviews((prev) => [...prev, newReview])
                 }}
              />
            </>
          )}
        </div>
      )}

      <p>Kategorija: {destination.category?.name || "Nenurodyta"}</p>
      <p>{destination.description}</p>
      <p>Aprašymas: {destination.fullDescription}</p>
      <p>Išvykimo data: {destination.departureDate}</p>
      <p>Trukmė: {destination.duration} dienos</p>
      <p>Kaina: {typeof destination.price === "number" ? destination.price.toFixed(2) : "Nenurodyta"} €</p>

      <div className="carousel-wrapper">
        <Slider {...settings}>
          {imageList.map((img, i) => (
            <div key={i} className="carousel-item">
              <img
                src={img}
                alt={`${destination.name} ${i + 1}`}
                className="carousel-image"
                onError={(e) => {
                  e.currentTarget.src = "/fallback.jpg"
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {hotels.length > 0 && (
        <>
          <h2>Viešbučiai siūlomi šios agentūros:</h2>
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
              reviewCount={hotel.reviewsCount || 0}
              averageRating={hotel.rating || 0}
              onAddToCart={() => console.log("Įdėta į krepšelį")}
            />
          ))}
        </>
      )}

      <button className="add-to-cart" onClick={addToCartHandler}>
        Įdėti į krepšelį
      </button>

      <div className="back-button">
        <button onClick={() => navigate(-1)} className="button">Grįžti atgal</button>
        <button onClick={() => navigate("/")} className="button">Grįžti į pagrindinį meniu</button>
      </div>
    </div>
  )
}

export default DestinationItem
