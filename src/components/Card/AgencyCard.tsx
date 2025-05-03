import { Link } from "react-router-dom"
import { Agencies } from "../../types/types"

interface AgencyProps {
  agency: Agencies
  
}

const AgencyCard: React.FC<AgencyProps> = ({ agency }) => {

      return (
        <div key={agency._id} className="agency border rounded p-4 shadow-md">
          <img
            src={agency.logo}
            alt={`${agency.name} logotipas`}
            style={{ width: "100%", maxHeight: "150px", objectFit: "contain", marginBottom: "1rem" }}
          />
          <h3>{agency.name}</h3>
          <p>{agency.location}</p>
          <p>📧 {agency.contactInfo?.email}</p>
          {agency.website && (
            <p>
              🌐 <a href={agency.website} target="_blank" rel="noopener noreferrer">{agency.website}</a>
            </p>
          )}
          {agency.establishedYear && <p>Įkurta: {agency.establishedYear}</p>}
    
    
          <Link to={`/agencies/${agency._id}`}>Plačiau</Link>
        </div>
      )
    }

export default AgencyCard
