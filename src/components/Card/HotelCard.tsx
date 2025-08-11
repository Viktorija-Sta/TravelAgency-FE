import type { Hotels } from "../../types/types"
import { useCart } from "../../hooks/useCart"
import { Link } from "react-router-dom"
import "./HotelCard.scss"
import { Rating } from "@mui/material"

interface HotelCardProps {
  hotel: Hotels
  averageRating: number
  reviewCount: number
  onAddToCart?: () => void
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, averageRating, reviewCount }) => {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      _id: hotel._id,
      name: hotel.name,
      price: hotel.pricePerNight,
      quantity: 1,
      image: hotel.image,
      modelType: "Hotel",
    })
   
  }

  return (
    <div className="hotel-card">
      <img src={hotel.image} alt={hotel.name}  />
      <h3>{hotel.name}</h3>
      <p>Vieta: {hotel.location}</p>
      <p>Kaina už naktį: {hotel.pricePerNight.toFixed(2)} €</p>

      <div className="hotel-rating">
        <Rating
          name="hotel-rating"
          value={averageRating || 0}
          readOnly
          precision={0.5}
          size="small"
        />
        <span>({reviewCount || 0} atsiliepimai)</span>
      </div>

      <button onClick={handleAddToCart}>Į krepšelį</button>
      <Link to={`/hotels/${hotel._id}`}>Peržiūrėti</Link>
    </div>
  )
}

export default HotelCard
