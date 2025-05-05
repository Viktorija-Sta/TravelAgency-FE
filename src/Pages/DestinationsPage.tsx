import { useEffect, useState } from "react"
import { Destinations, Categories, Reviews } from "../types/types"
import { getAllDestinations } from "../services/destinationApi"
import { useCart } from "../hooks/useCart"
import DestinationCard from "../components/Card/DestinationCard"
import api from "../utils/axios"
import SearchElement from "../SearchElement/SearchElement"

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
        ]);
  
        const allDest = res1.data || res1;
        setDestinations(allDest);
        setFiltered(allDest);
        setReviews(res2.data);
        setCategories(res3.data);
      } catch {
        
          setError("Įvyko netikėta klaida.");
        
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

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
        dest.name.toLowerCase().includes(lower) ||
        dest.location.toLowerCase().includes(lower)
      )
    }

    setFiltered(filteredResults)
  }

  if (loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="destinations-page">
      <h1>Kelionių sąrašas</h1>

      <SearchElement
        options={categories.map(cat => ({
          label: cat.name,
          value: cat._id
        }))}
        onFilterChange={handleFilterChange}
        placeholder="Ieškoti kelionės..."
      />

      <div className="destination-list">
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
            <DestinationCard
              key={destination._id}
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
                  
                })
              }
            />
          )
        })}
      </div>
    </div>
  )
}

export default DestinationsPage
