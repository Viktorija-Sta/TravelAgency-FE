import { Link } from "react-router"
import { Destinations } from "../../types/types"
import { useCart } from "../../hooks/useCart"

interface DestinationProps {
    destination: Destinations
}

const DestinationCard: React.FC<DestinationProps> = ({ destination }) => {
    const { addToCart } = useCart()
    return (
        <div key={destination._id} className="destination">
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="main-image"
              />
              <h3 >{destination.name}</h3>
              <p>{destination.description}</p>
            <p>€{destination.price}</p>
              
              <button
                onClick={() =>
                  addToCart({
                    _id: destination._id,
                    name: destination.name,
                    price: destination.price,
                    image: destination.imageUrl,
                    quantity: 1,
                  })
                }
                className="add-to-cart"
              >
                Į krepšelį
              </button>
              <Link
                to={`/destinations/${destination._id}`}
                className="button-more"
              >
                Plačiau
              </Link>
            </div>
    )
}

export default DestinationCard