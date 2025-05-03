import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../utils/axios"
import { Agencies, Destinations, Hotels } from "../types/types"
import DestinationCard from "../components/Card/DestinationCard"
import HotelCard from "../components/Card/HotelCard"

const AgencyItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [agency, setAgency] = useState<Agencies | null>(null)
  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        const [agencyRes, destinationsRes, hotelsRes] = await Promise.all([
          api.get(`/agencies/${id}`),
          api.get(`/destinations?agency=${id}`),
          api.get(`/hotels?agency=${id}`)
        ])

        setAgency(agencyRes.data.agency || agencyRes.data)
        setDestinations(destinationsRes.data)
        setHotels(hotelsRes.data)
      } catch (err) {
        console.error("Klaida gaunant agentūros duomenis:", err)
        setError("Nepavyko gauti agentūros informacijos")
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchAgencyData()
    }
  }, [id])

  if (loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>
  if (!agency) return <div>Agentūra nerasta</div>

  return (
    <div>
      <h1>{agency.name}</h1>
      <img src={agency.logo} alt={agency.name} />
      <p>{agency.fullDescription}</p>
      <p>
        Kontaktai: {agency.contactInfo.email}, {agency.contactInfo.phone}
      </p>

      {agency.website && (
        <p>
          Interneto svetainė:{" "}
          <a href={agency.website} target="_blank" rel="noopener noreferrer">
            {agency.website}
          </a>
        </p>
      )}

      {agency.establishedYear && <p>Įkurta: {agency.establishedYear}</p>}

      {destinations.length > 0 && (
        <>
          <h2>Kelionės siūlomos šios agentūros:</h2>
          {destinations.map((dest) => (
            <DestinationCard
              key={dest._id}
              destination={dest}
              onAddToCart={() => console.log("Įdėta į krepšelį")}
            />
          ))}
        </>
      )}

      {hotels.length > 0 && (
        <>
          <h2>Viešbučiai siūlomi šios agentūros:</h2>
          {hotels.map((hotel) => (
            <HotelCard
              key={hotel._id}
              hotel={hotel}
              reviewCount={hotel.reviewsCount || 0}
              averageRating={hotel.rating || 0}
              onAddToCart={() => console.log("Įdėta į krepšelį")}
            />
          ))}
        </>
      )}

      <button onClick={() => navigate(-1)}>Grįžti atgal</button>
      <button onClick={() => navigate("/")}>Grįžti į pagrindinį</button>
    </div>
  )
}

export default AgencyItem
