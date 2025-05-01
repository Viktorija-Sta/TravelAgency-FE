import { Link } from "react-router"
import { Agencies } from "../../types/types"

interface AgencyProps {
    agency: Agencies
}

const AgencyCard: React.FC<AgencyProps> = ({ agency }) => {

    return (
        <div key={agency._id} className="border rounded p-4 shadow">
            <h3 className="text-lg font-semibold">{agency.name}</h3>
            <p className="text-sm">{agency.location}</p>
            <p className="text-sm">📧 {agency.contactInfo?.email}</p>
            <Link
            to={`/agencies/${agency._id}`}
            className="text-blue-500 mt-2 inline-block hover:underline"
            >
            Plačiau
            </Link>
        </div>
    )

}

export default AgencyCard