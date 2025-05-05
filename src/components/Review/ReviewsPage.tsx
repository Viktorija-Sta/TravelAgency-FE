import { useEffect, useState } from "react"
import { Reviews } from "../../types/types"
import { Link } from "react-router-dom"
import api from "../../utils/axios"

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

  const renderStars = (rating: number) => {
    const full = "★".repeat(Math.round(rating))
    const empty = "☆".repeat(5 - Math.round(rating))
    return full + empty
  }

  if (loading) return <div className="text-center py-10">Kraunama...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="reviews-page">
      <h1 >Atsiliepimai</h1>

      <div style={{ marginBottom: "10px" }}>
        <label>Filtruoti pagal: </label>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "all" | "hotels" | "destinations" | "agencies")
          }
        >
          <option value="all">Visi</option>
          <option value="hotels">Viešbučiai</option>
          <option value="destinations">Kelionių kryptys</option>
          <option value="agencies">Agentūros</option>
        </select>
      </div>

      {filteredReviews.length === 0 ? (
        <p>Atsiliepimų nėra.</p>
      ) : (
        filteredReviews.map((review) => (
          <div
            key={review._id}
            
          >
            <p><strong>{review.user.username}</strong>: {review.comment}</p>
            <p>
              Vertinimas: {renderStars(review.rating)} ({review.rating})
            </p>
            {review.destination && typeof review.destination !== "string" && (
              <p>
                Kelionė: <Link to={`/destinations/${review.destination._id}`} >{review.destination.name}</Link>
              </p>
            )}
            {review.hotel && typeof review.hotel !== "string" && (
              <p>
                Viešbutis: <Link to={`/hotels/${review.hotel._id}`} >{review.hotel.name}</Link>
              </p>
            )}
            {review.agency && typeof review.agency !== "string" && (
              <p>
                Agentūra: <Link to={`/agencies/${review.agency._id}`} >{review.agency.name}</Link>
              </p>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default ReviewsPage
