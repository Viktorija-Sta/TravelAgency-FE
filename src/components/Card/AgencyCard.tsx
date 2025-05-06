import { Link } from "react-router-dom"
import { Agencies } from "../../types/types"
import "./AgencyCard.scss"

interface AgencyProps {
  agency: Agencies
  averageRating: number
  reviewCount: number
}

const AgencyCard: React.FC<AgencyProps> = ({ agency, averageRating, reviewCount }) => {

  const renderStars = (rating: number) => {
    const fullStars = Math.round(rating)
    const totalStars = 5
    return "★".repeat(fullStars) + "☆".repeat(totalStars - fullStars)
  }

  return (
    <div key={agency._id} className="agency-card">
      <img
        src={agency.logo}
        alt={`${agency.name} logotipas`}
      />
      <h3>{agency.name}</h3>
      <p>{agency.location}</p>
      <p>📧 {agency.contactInfo?.email}</p>
      {agency.website && (
        <p>🌐 <a href={agency.website} target="_blank" rel="noopener noreferrer">{agency.website}</a></p>
      )}
      {agency.establishedYear && <p>Įkurta: {agency.establishedYear}</p>}

      <div className="mt-2 mb-2 text-sm text-gray-600">
        {renderStars(averageRating || 0)} ({reviewCount || 0} atsiliepimai)
      </div>

      <Link to={`/agencies/${agency._id}`}>Plačiau</Link>
    </div>
  )
}

export default AgencyCard
