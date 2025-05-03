import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import api from "../utils/axios"
import { Agencies, Destinations, Hotels, Reviews } from "../types/types"
import DestinationCard from "../components/Card/DestinationCard"
import HotelCard from "../components/Card/HotelCard"

const AgencyItem: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [agency, setAgency] = useState<Agencies | null>(null)
  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showReviews, setShowReviews] = useState(false)
  
 
    useEffect(() => {
      const fetchAgencyData = async () => {
        try {
          const agencyRes = await api.get(`/agencies/${id}`)
          const { agency, destinations, hotels, reviews } = agencyRes.data
    
          setAgency(agency)
          setDestinations(destinations)
          setHotels(hotels)
          setReviews(reviews)
        } catch (err) {
          console.error("Klaida gaunant agentūros duomenis:", err)
          setError("Nepavyko gauti agentūros informacijos")
        } finally {
          setLoading(false)
        }
      }
    
      if (id) fetchAgencyData()
    }, [id])
  
  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating)
    return "★".repeat(fullStars) + "☆".repeat(5 - fullStars)
  }
  
  const averageRating = reviews.length
  ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
  : 0
  
  if (loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>
  if (!agency) return <div>Agentūra nerasta</div>
  
  console.log("🚀 ~ reviews:", reviews)
  return (
    <div>
      <h1>{agency.name}</h1>
      <p>
        Įvertinimas: {renderStars(averageRating)} ({reviews.length}){" "}
        <button onClick={() => setShowReviews((prev) => !prev)} className="ml-2 text-blue-600 underline">
          {showReviews ? "Slėpti atsiliepimus" : "Rodyti atsiliepimus"}
        </button>
      </p>

      {showReviews && (
        <div className="bg-gray-100 p-4 mt-2 rounded">
          {reviews.length === 0 ? (
            <p>Nėra atsiliepimų apie šią agentūrą.</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="mb-2 border-b pb-2">
                <p className="font-semibold">{review.user?.username || "Anonimas"}</p>
                <p>{renderStars(review.rating)}</p>
                <p>{review.comment}</p>
              </div>
            ))
          )}
        </div>
      )}

      <img src={agency.logo} alt={agency.name} />
      <p>{agency.fullDescription}</p>
      <p>
        Kontaktai: {agency.contactInfo?.email}, {agency.contactInfo?.phone}
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
