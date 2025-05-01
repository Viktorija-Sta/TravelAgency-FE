import { Link } from "react-router"
import { Agencies } from "../../types/types"

interface AgencyProps {
    agency: Agencies
}

const AgencyCard: React.FC<AgencyProps> = ({ agency }) => {

    return (
        <div key={agency._id} className="agency">
            <h3>{agency.name}</h3>
            <p>{agency.location}</p>
            <p>📧 {agency.contactInfo?.email}</p>
            <Link
            to={`/agencies/${agency._id}`}
            className="button-more"
            >
            Plačiau
            </Link>
        </div>
    )

}

export default AgencyCard