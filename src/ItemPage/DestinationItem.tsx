import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import { useEffect, useState } from "react"
import { Destinations, Reviews } from "../types/types"
import api from "../utils/axios"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import "./DestinationItem.scss"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

const DestinationItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [destination, setDestination] = useState<Destinations | null>(null)
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviews, setShowReviews] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/destinations/${id}`)
        setDestination(res.data.destination || res.data)
        setReviews(res.data.reviews || []) // 👈 gauna tik susijusius review'us
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
        image: destination.imageUrl,
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
        <button onClick={() => setShowReviews((prev) => !prev)} className="ml-2 text-blue-600 underline">
          {showReviews ? "Slėpti atsiliepimus" : "Rodyti atsiliepimus"}
        </button>
      </p>

      {showReviews && (
        <div className="bg-gray-100 p-4 mt-2 rounded">
          {reviews.length === 0 ? (
            <p>Nėra atsiliepimų apie šią kelionę.</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="mb-2 border-b pb-2">
                <p className="font-semibold">{review.user?.username || "Anonimas"}</p>
                <p>{renderStars(review.rating)}</p>
                <p>{review.comment}</p>
              </div>
            ))
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
