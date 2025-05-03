import { useNavigate, useParams } from "react-router-dom"
import { useCart } from "../hooks/useCart"
import { useEffect, useState } from "react"
import api from "../utils/axios"
import "./destinationItem.scss"
import { Hotels, Reviews } from "../types/types"

const HotelItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [hotel, setHotel] = useState<Hotels | null>(null)
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/hotels/${id}`)
        setHotel(response.data.hotel || response.data)
      } catch {
        setError("Nepavyko gauti viešbučio")
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews?hotel=${id}`)
        setReviews(res.data)
      } catch (err) {
        console.error("Nepavyko gauti atsiliepimų", err)
      }
    }

    if (id) {
      fetchData()
      fetchReviews()
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
    const totalStars = 5
    return "★".repeat(fullStars) + "☆".repeat(totalStars - fullStars)
  }

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  const reviewCount = reviews.length

  if (loading) return <div className="text-center py-10">🔄 Kraunama...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>
  if (!hotel) return <div className="text-center py-10">Viešbutis nerasta</div>

  return (
    <div className="detail-page">
      <h1>{hotel.name}</h1>
      <p>{renderStars(averageRating)} ({reviewCount} atsiliepimai)</p>

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
