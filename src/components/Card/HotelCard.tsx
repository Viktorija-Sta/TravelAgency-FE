import { Link } from "react-router"
import { useCart } from "../../hooks/useCart"
import { Hotels } from "../../types/types"

interface HotelProps {
    hotel: Hotels
}

const HotelCard: React.FC<HotelProps> = ({ hotel }) => {
    const { addToCart } = useCart()

    return (
        <div key={hotel._id} className="border rounded p-4 shadow">
              <h3 className="text-lg font-semibold">{hotel.name}</h3>
              <p className="text-sm">{hotel.location}</p>
              <p className="text-sm">€{hotel.pricePerNight}/naktis</p>
              <Link
                to={`/hotels/${hotel._id}`}
                className="text-blue-500 mt-2 inline-block hover:underline"
              >
                Plačiau
              </Link>
              <button
                onClick={() =>
                  addToCart({
                    _id: hotel._id,
                    name: hotel.name,
                    price: hotel.pricePerNight,
                    quantity: 1,
                  })
                }
                className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
              >
                Į krepšelį
              </button>
            </div>
    )

}

export default HotelCard