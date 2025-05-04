import { useEffect, useState } from "react"
import { Reviews } from "../types/types"
import { Link } from "react-router-dom"
import api from "../utils/axios"

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const renderStars = (rating: number) => {
    const full = "★".repeat(Math.round(rating))
    const empty = "☆".repeat(5 - Math.round(rating))
    return full + empty
  }

  if (loading) return <div className="text-center py-10">Kraunama...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Visi atsiliepimai</h1>
      {reviews.map((review) => (
        <div
          key={review._id}
          className="border p-4 rounded shadow space-y-1"
        >
          <p><strong>{review.user.username}</strong>: {review.comment}</p>
          <p>
            Vertinimas: {renderStars(review.rating)} ({review.rating})
          </p>
          {review.destination && typeof review.destination !== "string" && (
            <p>
              Kelionė: <Link to={`/destinations/${review.destination._id}`} className="text-blue-500 underline">{review.destination.name}</Link>
            </p>
          )}
          {review.hotel && typeof review.hotel !== "string" && (
            <p>
              Viešbutis: <Link to={`/hotels/${review.hotel._id}`} className="text-blue-500 underline">{review.hotel.name}</Link>
            </p>
          )}
          {review.agency && typeof review.agency !== "string" && (
            <p>
              Agentūra: <Link to={`/agencies/${review.agency._id}`} className="text-blue-500 underline">{review.agency.name}</Link>
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export default ReviewsPage
