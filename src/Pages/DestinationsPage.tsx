import { useEffect, useState } from "react"
import { Destinations, Categories, Reviews } from "../types/types"
import { getAllDestinations } from "../services/destinationApi"
import { useCart } from "../hooks/useCart"
import DestinationCard from "../components/Card/DestinationCard"
import api from "../utils/axios"
import SearchElement from "../components/SearchElement/SearchElement"
import { CircularProgress, Container, Grid, Typography } from "@mui/material"
import "./DestinationsPage.scss"

const DestinationsPage: React.FC = () => {
  const { addToCart } = useCart()

  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [filtered, setFiltered] = useState<Destinations[]>([])
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [categories, setCategories] = useState<Categories[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2, res3] = await Promise.all([
          getAllDestinations(),
          api.get("/reviews"),
          api.get("/categories"),
        ])
  
        const allDest = res1.data || res1
        
        setDestinations(allDest)
        setFiltered(allDest)
        setReviews(res2.data)
        setCategories(res3.data)
      } catch {
        
          setError("Įvyko netikėta klaida.")
        
      } finally {
        setLoading(false)
      }
    }
  
    fetchData()
  }, [])

  const handleFilterChange = (selectedCategoryIds: string[], searchTerm: string) => {
    let filteredResults = destinations

    if (selectedCategoryIds.length > 0) {
      filteredResults = filteredResults.filter(dest =>
        selectedCategoryIds.includes(dest.category?._id)
      )
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase()
      filteredResults = filteredResults.filter(dest =>
        dest.name.toLowerCase().includes(lower)
      )
    }

    setFiltered(filteredResults)
  }

  if (loading) return (
      <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
      </Container>
    )
    if (error) return <Typography color="error">{error}</Typography>

  return (
    <Container className="destinations-page" maxWidth="lg" sx={{ paddingX: { xs: 2, sm: 3, md: 4 }, paddingY: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kelionių sąrašas
      </Typography>

      <SearchElement
        options={categories.map(cat => ({
          label: cat.name,
          value: cat._id
        }))}
        onFilterChange={handleFilterChange}
        placeholder="Ieškoti kelionės..."
      />

      <Grid container spacing={3} className="destination-list" marginTop={2}>
        {filtered.map(destination => {
          const relatedReviews = reviews.filter(review => {
            const destId = typeof review.destination === "string"
              ? review.destination
              : review.destination?._id
            return destId === destination._id
          })

          const avgRating =
            relatedReviews.length > 0
              ? relatedReviews.reduce((acc, r) => acc + r.rating, 0) / relatedReviews.length
              : 0

          return (
            <Grid  key={destination._id} size={{ xs: 11, sm: 6, md: 4, lg: 4}}
            >
              <DestinationCard
                destination={destination}
                averageRating={avgRating}
                reviewCount={relatedReviews.length}
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
          )
        })}
      </Grid>
    </Container>
  )
}

export default DestinationsPage
