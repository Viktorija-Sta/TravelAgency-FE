import { Link } from "react-router-dom"
import { Agencies } from "../../types/types"
import "./AgencyCard.scss"
import { Rating } from "@mui/material"

interface AgencyProps {
  agency: Agencies
  averageRating: number
  reviewCount: number
}

const AgencyCard: React.FC<AgencyProps> = ({ agency, averageRating, reviewCount }) => {


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

      <div className="agency-rating">
        <Rating
          name="agency-rating"
          value={averageRating || 0}
          readOnly
          precision={0.5}
          size="small"
        />
        <span>({reviewCount || 0} atsiliepimai)</span>
      </div>

      <Link to={`/agencies/${agency._id}`}>Plačiau</Link>
    </div>
  )
}

export default AgencyCard
