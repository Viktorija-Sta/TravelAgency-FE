import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import { useEffect, useState } from "react"
import api from "../utils/axios"
import "./destinationItem.scss"
import { Hotels, Reviews } from "../types/types"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

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

    if (id) {
      fetchData()
    }
  }, [id])

  const addToCartHandler = () => {
    if (hotel) {
      addToCart({
        _id: hotel._id,
        name: hotel.name,
        price: hotel.pricePerNight,
        quantity: 1,
      })
      alert(`${hotel.name} buvo pridėta į krepšelį`)
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
  

  if (loading) return <div className="text-center py-10">🔄 Kraunama...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>
  if (!hotel) return <div className="text-center py-10">Viešbutis nerasta</div>

  return (
    <div className="detail-page">
      <h1>{hotel.name}</h1>
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

      <p>Kategorija: {hotel.category?.name || "Nenurodyta"}</p>
      <p>{hotel.description}</p>

      {hotel.amenities && hotel.amenities.length > 0 && (
        <div className="amenities-list">
          <h3>Patogumai:</h3>
          <ul>
            {hotel.amenities.map((amenity, index) => (
              <li key={index} className="amenity-item">{amenity}</li>
            ))}
          </ul>
        </div>
      )}

      <p>Kaina: {typeof hotel.pricePerNight === "number" ? hotel.pricePerNight.toFixed(2) : "Nenurodyta"} €</p>

      <div className="carousel-wrapper">
        <Slider {...settings}>
          {imageList.map((img, i) => (
            <div key={i} className="carousel-item">
              <img
                src={img}
                alt={`${hotel.name} ${i + 1}`}
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
        <button className="button" onClick={() => navigate("/")}>Grįžti į pagrindinį meniu</button>
      </div>
    </div>
  )
}

export default HotelItem
