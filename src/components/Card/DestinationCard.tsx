import { Link } from "react-router-dom"
import { Destinations } from "../../types/types"
import { useCart } from "../../hooks/useCart"

interface DestinationProps {
  destination: Destinations
  reviewCount: number
  averageRating: number
  onAddToCart: () => void
}

const DestinationCard: React.FC<DestinationProps> = ({
  destination,
  reviewCount,
  averageRating,
  onAddToCart,
}) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({ ...destination, quantity: 1 })
    onAddToCart()
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating)
    const totalStars = 5
    return "★".repeat(fullStars) + "☆".repeat(totalStars - fullStars)
  }

  return (
    <div className="destination">
      <img
        src={destination.imageUrl}
        alt={destination.name}
        className="main-image"
      />
      <h3>{destination.name}</h3>
      <p>{destination.description}</p>
      <p>€{destination.price}</p>

      <div className="mt-2 mb-2 text-sm text-gray-600">
        {renderStars(averageRating)} ({reviewCount} atsiliepimai)
        <br />
        <Link
          to={`/destinations/${destination._id}/reviews`}
          className="text-blue-500 hover:underline"
        >
          Žiūrėti visus atsiliepimus
        </Link>
      </div>

      <button onClick={handleAddToCart} className="add-to-cart">
        Į krepšelį
      </button>

      <Link to={`/destinations/${destination._id}`} className="button-more">
        Plačiau
      </Link>
    </div>
  )
}

export default DestinationCard
