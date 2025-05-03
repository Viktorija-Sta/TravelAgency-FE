import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Agencies, Destinations, Hotels } from "../types/types"
import api from "../utils/axios"
import DestinationCard from "../components/Card/DestinationCard"
import HotelCard from "../components/Card/HotelCard"
import AgencyCard from "../components/Card/AgencyCard"
import { useCart } from "../hooks/useCart"

const HomePage: React.FC = () => {
  const { addToCart } = useCart()

  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [agencies, setAgencies] = useState<Agencies[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [destinationRes, hotelRes, agencyRes] = await Promise.all([
          api.get("/destinations"),
          api.get("/hotels"),
          api.get("/agencies")
        ])

        setDestinations(destinationRes.data.slice(0, 3))
        setHotels(hotelRes.data.slice(0, 3))
        setAgencies(agencyRes.data.slice(0, 3))
      } catch (error) {
        console.error("Klaida gaunant duomenis:", error)
        setError("Nepavyko gauti duomenų")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="text-center py-10">🔄 Kraunama...</div>
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>

  return (
    <div>
      <section>
        <h2 className="text-2xl font-bold mb-4">Top 3 Kelionės</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination._id}
              destination={destination}
              onAddToCart={() =>
                addToCart({
                  _id: destination._id,
                  name: destination.name,
                  price: destination.price,
                  image: destination.imageUrl,
                  quantity: 1
                })
              }
            />
          ))}
        </div>
        <div className="text-right mt-2">
          <Link to="/destinations" className="text-blue-500 hover:underline">
            Žiūrėti visas keliones
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Top 3 Viešbučiai</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
              reviewCount={hotel.reviewsCount}
              averageRating={hotel.averageRating}
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
        <div className="text-right mt-2">
          <Link to="/hotels" className="text-blue-500 hover:underline">
            Žiūrėti visus viešbučius
          </Link>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Top 3 Agentūros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agencies.map((agency) => (
            <AgencyCard key={agency._id} agency={agency} />
          ))}
        </div>
        <div className="text-right mt-2">
          <Link to="/agencies" className="text-blue-500 hover:underline">
            Žiūrėti visas agentūras
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
