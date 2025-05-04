import { Destinations } from "../../types/types"
import { useCart } from "../../hooks/useCart"
import { Link } from "react-router";

interface DestinationProps {
  destination: Destinations
  averageRating: number;
  reviewCount: number;
  onAddToCart: () => void
}

const DestinationCard: React.FC<DestinationProps> = ({
  destination,
  averageRating,
  reviewCount,
  onAddToCart,
}) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({ ...destination, quantity: 1,  })
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
        style={{ width: "30%" }}
        src={destination.imageUrl}
        alt={destination.name}
        className="main-image"
      />
      <h3>{destination.name}</h3>
      <p>{destination.description}</p>
      <p>€{destination.price}</p>

      <div className="mt-2 mb-2 text-sm text-gray-600">
        {renderStars(averageRating || 0)} ({reviewCount || 0} atsiliepimai)
      </div>

      <button onClick={handleAddToCart} className="add-to-cart">
        Į krepšelį
      </button>

      <Link to={`/destinations/${destination._id}`}>Plačiau</Link>
    </div>
  )
}

export default DestinationCard
