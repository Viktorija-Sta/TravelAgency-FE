import { useEffect, useState, useCallback } from "react"
import { useCart } from "../hooks/useCart"
import { Destinations, Hotels } from "../types/types"
import api from "../utils/axios"
import HotelCard from "../components/Card/HotelCard"
import SearchElement from "../SearchElement/SearchElement"

const HotelsPage: React.FC = () => {
  const { addToCart } = useCart()
  const [allHotels, setAllHotels] = useState<Hotels[]>([])
  const [filteredHotels, setFilteredHotels] = useState<Hotels[]>([])
  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotelRes, destRes] = await Promise.all([
          api.get("/hotels"),
          api.get("/destinations"),
        ])
        setAllHotels(hotelRes.data)
        setFilteredHotels(hotelRes.data)
        setDestinations(destRes.data)
      } catch {
        setError("Nepavyko gauti viešbučių ar krypčių")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleFilterChange = useCallback(
    (selectedDestIds: string[], searchTerm: string) => {
      let filtered = [...allHotels]

      if (selectedDestIds.length > 0) {
        filtered = filtered.filter((hotel) =>
          selectedDestIds.includes(hotel.destination?._id)
        )
      }

      if (searchTerm.trim()) {
        const lower = searchTerm.toLowerCase()
        filtered = filtered.filter((hotel) =>
          hotel.name.toLowerCase().includes(lower) ||
          hotel.location.toLowerCase().includes(lower)
        )
      }

      setFilteredHotels(filtered)
    },
    [allHotels]
  )

  if (loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Viešbučių sąrašas</h1>

      <SearchElement
        options={destinations.map((d) => ({
          label: d.name,
          value: d._id,
        }))}
        onFilterChange={handleFilterChange}
        placeholder="Ieškoti viešbučio..."
      />

      <div>
        {filteredHotels.map((hotel) => (
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
                image: hotel.image,
                quantity: 1,
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

export default HotelsPage
