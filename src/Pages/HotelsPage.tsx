import { useEffect, useState, useCallback } from "react"
import { useCart } from "../hooks/useCart"
import type { Destinations, Hotels, Reviews } from "../types/types"
import api from "../utils/axios"
import HotelCard from "../components/Card/HotelCard"
import SearchElement from "../components/SearchElement/SearchElement"
import { CircularProgress, Container, Grid, Typography } from "@mui/material"
import "./HotelsPage.scss"

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
        const [hotelRes, destRes, reviewRes] = await Promise.all([
          api.get("/hotels"),
          api.get("/destinations"),
          api.get("/reviews")
        ])
        const hotels = hotelRes.data
        const reviews = reviewRes.data
  
        const hotelsWithReviews = hotels.map((hotel: Hotels) => {
          const related = reviews.filter((r: Reviews) => {
            const hId = typeof r.hotel === "string" ? r.hotel : r.hotel?._id

            return hId === hotel._id
          })
          const avg = related.length
            ? related.reduce((acc: number, r: Reviews) => acc + r.rating, 0) / related.length
            : 0
  
          return {
            ...hotel,
            reviewsCount: related.length,
            averageRating: avg
          }
        })
  
        setAllHotels(hotelsWithReviews)
        setFilteredHotels(hotelsWithReviews)
        setDestinations(destRes.data)
      } catch {
        setError("Nepavyko gauti viešbučių ar krypčių")
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
  }, [])

  const filterChangeHandler = useCallback(
    (selectedDestIds: string[], searchTerm: string) => {
      let filtered = [...allHotels]

      if (selectedDestIds.length > 0) {
        filtered = filtered.filter((hotel) =>
          selectedDestIds.includes(hotel.destination?._id)
        )
      }

      if (searchTerm.trim()) {
        const lower = searchTerm.toLowerCase()
        filtered = filtered.filter(hotel =>
          hotel.name.toLowerCase().includes(lower)
        )
      }

      setFilteredHotels(filtered)
    },
    [allHotels]
  )
  

  if (loading) return (
      <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
      </Container>
    )
    if (error) return <Typography color="error">{error}</Typography>

  return (
    <Container className="hotels-page" maxWidth="lg" sx={{ paddingX: { xs: 2, sm: 3, md: 4 }, paddingY: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Viešbučių sąrašas
      </Typography>

      
      <Grid size={{ xs: 9, sm: 6, md: 4, lg: 4 }}>
        <SearchElement
          options={destinations.map((d) => ({
            label: d.name,
            value: d._id,
          }))}
          onFilterChange={filterChangeHandler}
          placeholder="Ieškoti viešbučio..."
        />
      </Grid>
    


      <Grid container spacing={2}>
        {filteredHotels.map((hotel) => (
          <Grid  key={hotel._id} size={{ xs: 9, sm: 6, md: 4, lg: 4}}>
            <HotelCard
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
                  modelType: "Hotel",
                })
              }
            />
          </Grid>
        ))}
      </Grid>
        </Container>
    
  )
}

export default HotelsPage
