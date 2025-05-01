import { Link } from "react-router"
import { Destinations } from "../../types/types"
import { useCart } from "../../hooks/useCart"

interface DestinationProps {
    destination: Destinations
}

const DestinationCard: React.FC<DestinationProps> = ({ destination }) => {
    const { addToCart } = useCart()
    return (
        <div key={destination._id} className="border rounded p-4 shadow">
              <img
                src={destination.imageUrl}
                alt={destination.name}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="text-lg font-semibold mt-2">{destination.name}</h3>
              <p className="text-sm">{destination.description}</p>
            <p className="text-sm">€{destination.price}</p>
              
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
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Į krepšelį
              </button>
              <Link
                to={`/destinations/${destination._id}`}
                className="text-blue-500 mt-2 inline-block hover:underline"
              >
                Plačiau
              </Link>
            </div>
    )
}

export default DestinationCard