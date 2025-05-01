import { Link } from "react-router"
import { useCart } from "../../hooks/useCart"
import { Hotels } from "../../types/types"

interface HotelProps {
    hotel: Hotels
}

const HotelCard: React.FC<HotelProps> = ({ hotel }) => {
    const { addToCart } = useCart()

    const renderStars = (rating: number) => {
        const fullStars = Math.round(rating)
        return "⭐".repeat(fullStars)
    }

    return (
        <div key={hotel._id} className="hotel">
              <h3 >{hotel.name}</h3>
              <p>{hotel.location}</p>
              <p>€{hotel.pricePerNight}/naktis</p>

              <div className="mt-2 mb-2 text-sm text-gray-600">
                {renderStars(hotel.rating)}{" "}
                <Link to={`/destinations/${hotel._id}/reviews`} className="text-blue-500 hover:underline">
                    Žiūrėti atsiliepimus
                </Link>
            </div>
              <Link
                to={`/hotels/${hotel._id}`}
                className="button-more"
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
                className="add-to-cart"
              >
                Į krepšelį
              </button>
            </div>
    )

}

export default HotelCard