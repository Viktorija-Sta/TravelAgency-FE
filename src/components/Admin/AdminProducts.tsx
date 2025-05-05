import AdminHotels from "./AdminHotels";
import AdminAgencies from "./AdminAgencies";
import AdminDestinations from "./AdminDestinations";

const AdminProducts = () => {
  return (
    <div style={{ padding: "2rem" }}>
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
