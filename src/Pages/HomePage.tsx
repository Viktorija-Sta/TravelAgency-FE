import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Agencies, Destinations, Hotels, Reviews } from "../types/types"
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
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [destinationRes, hotelRes, agencyRes, reviewsRes] = await Promise.all([
          api.get("/destinations"),
          api.get("/hotels"),
          api.get("/agencies"),
          api.get("/reviews")
        ])

        setDestinations(destinationRes.data.slice(0, 3))
        setHotels(hotelRes.data.slice(0, 3))
        setAgencies(agencyRes.data.slice(0, 3))
        setReviews(reviewsRes.data)
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
    <div className="p-6 space-y-10">
      <section>
        <h2 className="text-2xl font-bold mb-4">Top 3 Kelionės</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {destinations.map((destination) => {
            const relatedReviews = reviews.filter((review) => {
              const id = typeof review.destination === "string" ? review.destination : review.destination?._id
              return id === destination._id
            })
            const averageRating = relatedReviews.length
              ? relatedReviews.reduce((acc, r) => acc + r.rating, 0) / relatedReviews.length
              : 0

            return (
              <DestinationCard
                key={destination._id}
                destination={destination}
                reviewCount={relatedReviews.length}
                averageRating={averageRating}
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
            )
          })}
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
            <HotelCard key={hotel._id} hotel={hotel} />
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
