import { useState } from "react"
import api from "../../utils/axios"
import { Reviews } from "../../types/types"
import './ReviewForm.scss'

interface ReviewFormProps {
  destinationId?: string
  hotelId?: string
  agencyId?: string
  onReviewSubmitted?: (newReview: Reviews) => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({ destinationId, hotelId, agencyId, onReviewSubmitted }) => {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rating || rating < 1 || rating > 5) {
      setError("Įvertinimas turi būti nuo 1 iki 5")
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log({ destinationId, hotelId, agencyId })

      const response = await api.post("/reviews", {
        rating,
        comment,
        destination: destinationId,
        hotel: hotelId,
        agency: agencyId,
      })

      const reviewWithUser: Reviews = {
        ...response.data.review,
        user: response.data.review.user || { username: "Anonimas" }
      }

      if (onReviewSubmitted) {
        onReviewSubmitted(reviewWithUser)
      }

      setComment("")
      setRating(5)
    } catch {
      setError("Nepavyko pateikti atsiliepimo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submitHandler} className="review-form">
      <h3>Parašykite atsiliepimą</h3>

      <label>
        Įvertinimas:
        <div className="star-rating">
          {[1, 2, 3, 4, 5].map((r) => (
            <span
              key={r}
              className={r <= rating ? "filled" : ""}
              onClick={() => setRating(r)}
            >
              ★
            </span>
          ))}
        </div>
      </label>

      <label>
        Komentaras:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Pasidalinkite įspūdžiais..."
          rows={3}
        />
      </label>

      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Siunčiama..." : "Pateikti"}
      </button>
    </form>
  )
}

export default ReviewForm
