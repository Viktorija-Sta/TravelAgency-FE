import { useEffect, useState } from "react"
import { useCart } from "../hooks/useCart"
import { Categories, Hotels } from "../types/types"
import api from "../utils/axios"
import HotelCard from "../components/Card/HotelCard"
import { getAllHotels, getHotelsByDestination } from "../services/hotelApi"

const HotelsPage: React.FC = () => {
  const { addToCart } = useCart()
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [destinations, setDestinations] = useState<Categories[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get("/destinations")
        setDestinations(res.data)
      } catch {
        console.error("Nepavyko gauti krypčių")
      }
    }
    fetchDestinations()
  }, [])

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)
      try {
        const data = selectedCategory
          ? await getHotelsByDestination(selectedCategory)
          : await getAllHotels()
        setHotels(data.data || data)
      } catch {
        setError("Nepavyko gauti viešbučių")
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [selectedCategory])

  if (loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Viešbučių sąrašas</h1>
      <label>
        Filtruoti pagal kryptį:{" "}
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Visos kryptys</option>
          {destinations.map((dest) => (
            <option key={dest._id} value={dest.name}>{dest.name}</option>
          ))}
        </select>
      </label>

      <div>
        {hotels.map((hotel) => (
          <HotelCard
            key={hotel._id}
            hotel={hotel}
            reviewCount={hotel.reviewsCount || 0}
            averageRating={hotel.rating || 0}
            onAddToCart={() =>
              addToCart({
                _id: hotel._id,
                name: hotel.name,
                price: hotel.pricePerNight,
                quantity: 1
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

export default HotelsPage
