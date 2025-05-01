import { Link } from "react-router"
import { Agencies } from "../../types/types"

interface AgencyProps {
    agency: Agencies
}

const AgencyCard: React.FC<AgencyProps> = ({ agency }) => {

    
    const renderStars = (rating: number) => {
        const fullStars = Math.round(rating)
        return "⭐".repeat(fullStars)
    }

    return (
        <div key={agency._id} className="agency">
            <h3>{agency.name}</h3>
            <p>{agency.location}</p>
            <p>📧 {agency.contactInfo?.email}</p>

            <div className="mt-2 mb-2 text-sm text-gray-600">
                {renderStars(agency.rating)}{" "}
                <Link to={`/destinations/${agency._id}/reviews`} className="text-blue-500 hover:underline">
                    Žiūrėti atsiliepimus
                </Link>
            </div>
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