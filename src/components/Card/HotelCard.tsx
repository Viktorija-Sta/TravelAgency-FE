import { Hotels } from "../../types/types"
import { useCart } from "../../hooks/useCart"
import { Link } from "react-router-dom"

interface HotelCardProps {
  hotel: Hotels
  averageRating: number
  reviewCount: number
  onAddToCart?: () => void
}

const HotelCard: React.FC<HotelCardProps> = ({
  hotel,
  averageRating,
  reviewCount,
  onAddToCart,
}) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      _id: hotel._id,
      name: hotel.name,
      price: hotel.pricePerNight,
      quantity: 1,
      image: hotel.image,
    })
    onAddToCart?.()
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating)
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars)
  }

  return (
    <div className="hotel-card">
      <img src={hotel.image} alt={hotel.name} style={{ width: "300px"}} />
      <h3>{hotel.name}</h3>
      <p>Vieta: {hotel.location}</p>
      <p>Kaina už naktį: {hotel.pricePerNight.toFixed(2)} €</p>
      <p>{renderStars(averageRating)} ({reviewCount} atsiliepimai)</p>

      <button onClick={handleAddToCart}>Į krepšelį</button>
      <Link to={`/hotels/${hotel._id}`}>Peržiūrėti</Link>
    </div>
  )
}

export default HotelCard
