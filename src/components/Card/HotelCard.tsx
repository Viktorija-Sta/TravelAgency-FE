import { useCart } from "../../hooks/useCart"
import { Hotels } from "../../types/types"

interface HotelProps {
  hotel: Hotels
  reviewCount: number
  averageRating: number
  onAddToCart: () => void
}

const HotelCard: React.FC<HotelProps> = ({ hotel, onAddToCart }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({ ...hotel, price: hotel.pricePerNight, quantity: 1 })
    onAddToCart()
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating)
    const totalStars = 5
    return "★".repeat(fullStars) + "☆".repeat(totalStars - fullStars)
  }

  return (
    <div key={hotel._id} className="hotel">
      <img
        style={{ width: "30%" }}
        src={hotel.image}
        alt={hotel.name}
        className="main-image"
      />
      <h3>{hotel.name}</h3>
      <p>{hotel.location}</p>
      <p>€{hotel.pricePerNight}/naktis</p>

      <div className="mt-2 mb-2 text-sm text-gray-600">
        {renderStars(hotel.averageRating || 0)} ({hotel.reviewsCount || 0} atsiliepimai)
      </div>

      <button onClick={handleAddToCart} className="add-to-cart">
        Į krepšelį
      </button>

      <a href={`/hotels/${hotel._id}`} className="button-more">
        Plačiau
      </a>
    </div>
  )
}

export default HotelCard
