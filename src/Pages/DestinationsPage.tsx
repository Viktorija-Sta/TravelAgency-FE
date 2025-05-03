import { useEffect, useState } from "react"
import { Destinations, Categories } from "../types/types"
import { getAllDestinations, getDestinationsByCategory } from "../services/destinationApi"
import { useCart } from "../hooks/useCart"
import DestinationCard from "../components/Card/DestinationCard"
import api from "../utils/axios"

const DestinationsPage: React.FC = () => {
  const { addToCart } = useCart()

  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [categories, setCategories] = useState<Categories[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories")
        setCategories(res.data)
      } catch {
        console.error("Nepavyko gauti kategorijų")
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = selectedCategory
          ? await getDestinationsByCategory(selectedCategory)
          : await getAllDestinations()

        setDestinations(data.data || data) 
      } catch {
        setError("Nepavyko gauti kelionių")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedCategory])

  const changeCategoryHandler = (value: string) => {
    setSelectedCategory(value)
  }

  if (loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Kelionių sąrašas</h1>

      <label>
        Filtruoti pagal kryptį:{" "}
        <select onChange={(e) => changeCategoryHandler(e.target.value)} value={selectedCategory}>
          <option value="">Visos kryptys</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>

      <div>
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
                quantity: 1,
              })
            }
          />
        ))}
      </div>
    </div>
  )
}

export default DestinationsPage
