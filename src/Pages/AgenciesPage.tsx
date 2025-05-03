import { useEffect, useState } from "react"
import { Agencies } from "../types/types"
import api from "../utils/axios"
import AgencyCard from "../components/Card/AgencyCard"

const AgenciesPage: React.FC = () => {

  const [agencies, setAgencies] = useState<Agencies[]>([])
  
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

    fetchData()
  }, [])

  if (loading) return <div>Kraunama...</div>
  if (error) return <div className="text-red-500">{error}</div>
  
  return (
 
    <div className="p-4">
      <h1>Kelionių Agentūrų Sąrašas</h1>
      <div>
        {agencies.map((agency) => (
          <AgencyCard key={agency._id} agency={agency} />
        ))}
      </div>
    </div>
  )
}

export default AgenciesPage
