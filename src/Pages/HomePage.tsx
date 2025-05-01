import { useEffect, useState } from "react"
import { useCart } from "../hooks/useCart"
import { Agencies, Categories, Destinations, Hotels } from "../types/types"
import api from "../utils/axios"

const HomePage: React.FC = () => {
    const { addToCart } = useCart()
    
    const [destinationst, setDestinations] = useState<Destinations[]>([])
    const [categories, setCategories] = useState<Categories[]>([])
    const [selectedCategory, setSelectedCategory] = useState("")
    const [hotels, setHotels] = useState<Hotels[]>([])
    const [agencies, setAgencies] = useState<Agencies[]>([])

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            try {
                const categoriesResponse = await api.get('/categories')
                setCategories(categoriesResponse.data)

                const destinationsResponse = await api.get('/destinations')
                setDestinations(destinationsResponse.data)

                const hotelsResponse = await api.get('/hotels')
                setHotels(hotelsResponse.data)

                const agenciesResponse = await api.get('/agencies')
                setAgencies(agenciesResponse.data)

                setLoading(false)
            } catch (err) {
                setLoading(false)
                setError("Klaida gaunant duomenis")
                console.error(err)

            }

        }
        fetchData()
    }, [])
}

export default HomePage