import { useEffect, useState } from "react"
import { Agencies, Reviews } from "../types/types"
import api from "../utils/axios"
import AgencyCard from "../components/Card/AgencyCard"

const AgenciesPage: React.FC = () => {

  const [agencies, setAgencies] = useState<Agencies[]>([])
   const [reviews, setReviews] = useState<Reviews[]>([])
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [agenciesRes] = await Promise.all([
          api.get("/agencies"),
          
        ])

        setAgencies(agenciesRes.data)
       
      } catch{
        setError("Nepavyko gauti agentūrų arba atsiliepimų")
      } finally {
        setLoading(false)
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await api.get("/reviews")
        setReviews(response.data)
      } catch {
        setError("Nepavyko gauti atsiliepimų")
      }
    }

    fetchData()
    fetchReviews()
  }, [])

  if (loading) return <div>Kraunama...</div>
  if (error) return <div className="text-red-500">{error}</div>
  
  return (
 
    <div className="p-4">
      <h1>Kelionių Agentūrų Sąrašas</h1>
      <div>
      {agencies.map((agency) => {
        const relatedReviews = reviews.filter((review) => {
          const reviewAgencyId =
            typeof review.agency === "string"
              ? review.agency
              : review.agency?._id

          return reviewAgencyId === agency._id
        })

        const averageRating =
          relatedReviews.length > 0
            ? relatedReviews.reduce((acc, r) => acc + r.rating, 0) / relatedReviews.length
            : 0

        return (
          <AgencyCard key={agency._id} agency={agency} averageRating={averageRating} reviewCount={relatedReviews.length}/>
        )
      })}
      </div>
    </div>
  )
}

export default AgenciesPage
