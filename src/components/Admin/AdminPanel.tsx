import { Link, useNavigate } from "react-router"

const AdminPanel: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="admin-panel">
            <h1>Administravimo puslapis</h1>

            <div className="admin-buttons">
                <div className="admin-button-wrapper">
                    <Link to='/admin/products' className="admin-button">
                        Valdyti duomenis
                    </Link>
                </div>
                
                <div className="admin-button-wrapper">
                    <Link to='/admin/orders' className="admin-button">
                        Valdyti užsakymus
                    </Link>
                </div>
                <div className="admin-button-wrapper">
                    <Link to='/admin/metrics' className="admin-button">
                        Užsakymų statistika
                    </Link>
                </div>
            </div>
            <button className="button" onClick={() => navigate('/')}>GrĮžti į pagrindinį puslapį</button>
        </div>
    )
}

export default AdminPanel