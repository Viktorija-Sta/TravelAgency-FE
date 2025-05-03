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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/destinations/${id}`)
        setDestination(response.data.destination || response.data)
      } catch {
        setError("Nepavyko gauti kelionės")
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews?destination=${id}`)
        setReviews(res.data)
      } catch {
        console.error("Nepavyko gauti atsiliepimų")
      }
    }

    if (id) {
      fetchData()
      fetchReviews()
    }
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
    const totalStars = 5
    return "★".repeat(fullStars) + "☆".repeat(totalStars - fullStars)
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0

  const imageList =
    destination?.gallery.length === 1
      ? [destination.gallery[0], destination.gallery[0]]
      : destination?.gallery || []

  const NextArrow = ({ onClick }: { onClick?: () => void }) => (
    <div className="custom-arrow next" onClick={onClick}>
      <FiChevronRight />
    </div>
  )

  const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
    <div className="custom-arrow prev" onClick={onClick}>
      <FiChevronLeft />
    </div>
  )

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  }

  if (loading) return <div className="text-center py-10">🔄 Kraunama...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>
  if (!destination) return <div className="text-center py-10">Kelionė nerasta</div>

  return (
    <div className="detail-page">
      <h1>{destination.name}</h1>
      <p>Įvertinimas: {renderStars(averageRating)} ({reviews.length})</p>

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
        <button onClick={() => navigate(-1)} className="button">
          Grįžti atgal
        </button>
        <button className="button" onClick={() => navigate("/")}>
          Grįžti į pagrindinį meniu
        </button>
      </div>
    </div>
  )
}

export default DestinationItem
