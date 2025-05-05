import AdminHotels from "./AdminHotels";
import AdminAgencies from "./AdminAgencies";
import AdminDestinations from "./AdminDestinations";
import Breadcrumb from "../Breadcrumb/Breadcrumb";

const AdminProducts = () => {
  return (
    <div style={{ padding: "2rem" }}>
        <Breadcrumb />
      <h1>Produktų administravimas</h1>

      <section>
        <AdminHotels />
      </section>

      <hr />

      <section>
        <AdminAgencies />
      </section>

      <hr />

      <section>
        <AdminDestinations />
      </section>
    </div>
  );
};

export default AdminProducts;
