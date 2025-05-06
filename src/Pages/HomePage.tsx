import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Agencies, Destinations, Hotels, Reviews } from "../types/types"
import api from "../utils/axios"
import DestinationCard from "../components/Card/DestinationCard"
import HotelCard from "../components/Card/HotelCard"
import AgencyCard from "../components/Card/AgencyCard"
import { useCart } from "../hooks/useCart"
import Grid from "@mui/material/Grid"
import Typography from "@mui/material/Typography"
import "./HomePage.scss"

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
        const [destinationRes, hotelRes, agencyRes, reviewRes] = await Promise.all([
          api.get("/destinations"),
          api.get("/hotels"),
          api.get("/agencies"),
          api.get("/reviews"),
        ])

        const allReviews = reviewRes.data

        const destinations = destinationRes.data
          .map((dest: Destinations) => {
            const destReviews = allReviews.filter((r: Reviews) =>
              typeof r.destination === "string"
                ? r.destination === dest._id
                : r.destination?._id === dest._id
            )
            const reviewCount = destReviews.length
            const averageRating = reviewCount
              ? destReviews.reduce((sum: number, r: Reviews) => sum + r.rating, 0) / reviewCount
              : 0

            return { ...dest, reviewCount, averageRating }
          })
          .sort((a: Destinations, b: Destinations) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 3)

        const hotels = hotelRes.data
          .map((hotel: Hotels) => {
            const hotelReviews = allReviews.filter((r: Reviews) =>
              typeof r.hotel === "string"
                ? r.hotel === hotel._id
                : r.hotel?._id === hotel._id
            )
            const reviewCount = hotelReviews.length
            const averageRating = reviewCount
              ? hotelReviews.reduce((sum: number, r: Reviews) => sum + r.rating, 0) / reviewCount
              : 0

            return { ...hotel, reviewsCount: reviewCount, averageRating }
          })
          .sort((a: Hotels, b: Hotels) => b.averageRating - a.averageRating)
          .slice(0, 3)

        const agencies = agencyRes.data
          .map((agency: Agencies) => {
            const agencyReviews = allReviews.filter((r: Reviews) =>
              typeof r.agency === "string"
                ? r.agency === agency._id
                : r.agency?._id === agency._id
            )
            const reviewCount = agencyReviews.length
            const averageRating = reviewCount
              ? agencyReviews.reduce((sum: number, r: Reviews) => sum + r.rating, 0) / reviewCount
              : 0

            return { ...agency, reviewCount, averageRating }
          })
          .sort((a: Agencies, b: Agencies) => (b.averageRating || 0) - (a.averageRating || 0))
          .slice(0, 3)

        setDestinations(destinations)
        setHotels(hotels)
        setAgencies(agencies)
      } catch (error) {
        console.error("Klaida gaunant duomenis:", error)
        setError("Nepavyko gauti duomenų")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="home-page">
      <section>
        <Typography variant="h4" component="h2">Top 3 Kelionės</Typography>
        <Grid container spacing={3} justifyContent="center">
          {destinations.map((destination) => (
            <Grid  key={destination._id} size={{xs: 12, sm: 6, md: 4}}>
              <DestinationCard
                destination={destination}
                reviewCount={destination.reviewCount || 0}
                averageRating={destination.averageRating || 0}
                onAddToCart={() =>
                  addToCart({
                    _id: destination._id,
                    name: destination.name,
                    price: destination.price,
                    image: destination.imageUrl,
                    quantity: 1,
                    modelType: "Destination"
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
        <div className="more">
          <Link to="/destinations" className="more">Žiūrėti visas keliones {'>>>'}</Link>
        </div>
      </section>

      <section>
        <Typography variant="h4" component="h2">Top 3 Viešbučiai</Typography>
        <Grid container spacing={3} justifyContent="center">
          {hotels.map((hotel) => (
            <Grid key={hotel._id} size={{xs: 12, sm: 6, md: 4}}>
              <HotelCard
                hotel={hotel}
                reviewCount={hotel.reviewsCount || 0}
                averageRating={hotel.averageRating || 0}
                onAddToCart={() =>
                  addToCart({
                    _id: hotel._id,
                    name: hotel.name,
                    price: hotel.pricePerNight,
                    quantity: 1,
                    image: hotel.image,
                    modelType: "Hotel"
                  })
                }
              />
            </Grid>
          ))}
        </Grid>
        <div className="more">
          <Link to="/hotels" className="more">Žiūrėti visus viešbučius {'>>>'}</Link>
        </div>
      </section>

      <section>
        <Typography variant="h4" component="h2">Top 3 Agentūros</Typography>
        <Grid container spacing={3} justifyContent="center">
          {agencies.map((agency) => (
            <Grid key={agency._id} size={{xs: 12, sm: 6, md: 4}}>
              <AgencyCard
                agency={agency}
                averageRating={agency.averageRating || 0}
                reviewCount={agency.reviewCount || 0}
              />
            </Grid>
          ))}
        </Grid>
        <div className="more">
          <Link to="/agencies" className="more">Žiūrėti visas agentūras {'>>>'}</Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage
