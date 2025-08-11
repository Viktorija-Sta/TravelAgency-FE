import type { Reviews } from "../../types/types"

interface ReviewsListProps {
  reviews: Reviews[]
  title?: string
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, title }) => {
  if (reviews.length === 0) {
    return <p>Atsiliepimų nėra.</p>
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating)
    const totalStars = 5
    return "★".repeat(fullStars) + "☆".repeat(totalStars - fullStars)
  }

  return (
    <div>
      {title && <h2>{title}</h2>}
      <p>
        Vidutinis įvertinimas: {renderStars(averageRating)} ({averageRating.toFixed(1)}) iš {reviews.length} atsiliepimų
      </p>
      <div>
        {reviews.map((review) => (
          <div key={review._id} style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}>
            <p><strong>{review.user.username}</strong>:</p>
            <p>{review.comment}</p>
            <p>Įvertinimas: {renderStars(review.rating)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReviewsList
