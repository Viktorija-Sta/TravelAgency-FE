import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Agencies, Hotels } from "../../types/types";
import api from "../../utils/axios";

const AdminHotels = () => {
  const [hotels, setHotels] = useState<Hotels[]>([]);
  const [agencies, setAgencies] = useState<Agencies[]>([]);
  const [newHotel, setNewHotel] = useState<Partial<Hotels>>({});
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      const res = await api.get("/hotels");
      setHotels(res.data);
    } catch (err) {
      console.error("Klaida gaunant viešbučius:", err);
    }
  };

  const fetchAgencies = async () => {
    try {
      const res = await api.get("/agencies");
      setAgencies(res.data);
    } catch (err) {
      console.error("Klaida gaunant agentūras:", err);
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchAgencies();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHotel({ ...newHotel, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    try {
      await api.post("/hotels", newHotel);
      setNewHotel({});
      fetchHotels();
    } catch (err) {
      console.error("Nepavyko sukurti:", err);
    }
  };

  const handleUpdate = async () => {
    if (!editingHotelId) return;
    try {
      await api.put(`/hotels/${editingHotelId}`, newHotel);
      setNewHotel({});
      setEditingHotelId(null);
      fetchHotels();
    } catch (err) {
      console.error("Nepavyko atnaujinti:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/hotels/${id}`);
      fetchHotels();
    } catch (err) {
      console.error("Nepavyko ištrinti:", err);
    }
  };

  const startEdit = (hotel: Hotels) => {
    setEditingHotelId(hotel._id);
    setNewHotel(hotel);
  };

  return (
    <div>
      <h2>Viešbučių valdymas</h2>

      <label>Pavadinimas:
        <input name="name" value={newHotel.name || ""} onChange={handleChange} />
      </label>

      <label>Vieta:
        <input name="location" value={newHotel.location || ""} onChange={handleChange} />
      </label>

      <label>Kaina už naktį:
        <input name="pricePerNight" type="number" value={newHotel.pricePerNight || ""} onChange={handleChange} />
      </label>

      <label>Nuotraukos URL:
        <input name="image" value={newHotel.image || ""} onChange={handleChange} />
      </label>

      <label>Galerijos URL (atskirti kableliais):
        <input
          name="gallery"
          value={Array.isArray(newHotel.gallery) ? newHotel.gallery.join(", ") : ""}
          onChange={(e) =>
            setNewHotel({
              ...newHotel,
              gallery: e.target.value.split(",").map((url) => url.trim()),
            })
          }
        />
      </label>

      <label>Aprašymas:
        <input name="description" value={newHotel.description || ""} onChange={handleChange} />
      </label>

      <label>Agentūra:
        <select
          name="agency"
          value={typeof newHotel.agency === "string" ? newHotel.agency : (newHotel.agency as Agencies)?._id || ""}
          onChange={(e) => {
            const selectedAgency = agencies.find(a => a._id === e.target.value);
            setNewHotel({ ...newHotel, agency: selectedAgency || undefined });
          }}
        >
          <option value="">Pasirinkite agentūrą</option>
          {agencies.map(agency => (
            <option key={agency._id} value={agency._id}>
              {agency.name}
            </option>
          ))}
        </select>
      </label>

      {editingHotelId ? (
        <button onClick={handleUpdate}>Atnaujinti</button>
      ) : (
        <button onClick={handleCreate}>Sukurti</button>
      )}

      <ul>
        {hotels.map(hotel => (
          <li key={hotel._id}>
            <Link to={`/hotels/${hotel._id}`}>{hotel.name}</Link> - {hotel.location} - {hotel.pricePerNight} €
            <button onClick={() => startEdit(hotel)}>Redaguoti</button>
            <button onClick={() => handleDelete(hotel._id)}>Ištrinti</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHotels;
