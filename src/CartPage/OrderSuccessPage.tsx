import { Link } from "react-router"

const OrderSuccessPage: React.FC = () => {
    return (
        <div className="order-success-page">
            <h1>Ačiū! Užsakymas gautas</h1>
            <Link to="/my-orders" className="view-orders-button">
                Peržiūrėti užsakymus
            </Link>
            <Link to="/" className="back-to-home-button">
                Grįžti į pradžią
            </Link>
        </div>
    )
}

export default OrderSuccessPage 