import { useCart } from "../../hooks/useCart"
import { Link } from "react-router"
import { toast } from "sonner"
import "./DestinationCard.scss"
import { Rating } from "@mui/material"
import type { Destinations } from "../../types/types"

interface DestinationProps {
  destination: Destinations
  averageRating: number
  reviewCount: number
  onAddToCart: () => void
}

const DestinationCard: React.FC<DestinationProps> = ({
  destination,
  averageRating,
  reviewCount,
 
}) => {
  const { addToCart } = useCart()

  const addToCartHandler = () => {
    addToCart({ 
      _id: destination._id,
      name: destination.name,
      price: destination.price,
      image: destination.imageUrl,
      quantity: 1  ,
      modelType: "Destination",
    })
    toast.success(`${destination.name} buvo pridėta į krepšelį`)
    
  }

  return (
    <div className="destination-card">
      <img
        src={destination.imageUrl}
        alt={destination.name}
        className="main-image"
      />
      <h3>{destination.name}</h3>
      <p>{destination.description}</p>
      <p>€{destination.price}</p>

      <div className="destination-rating">
        <Rating
          name="destination-rating"
          value={averageRating || 0}
          readOnly
          precision={0.5}
          size="small"
        />
        <span>({reviewCount || 0} atsiliepimai)</span>
      </div>

      <button onClick={addToCartHandler} className="add-to-cart">
        Į krepšelį
      </button>

      <Link to={`/destinations/${destination._id}`}>Plačiau</Link>
    </div>
  )
}

export default DestinationCard