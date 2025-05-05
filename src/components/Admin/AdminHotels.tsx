import { useEffect, useState } from "react";
import { Hotels } from "../../types/types";
import api from "../../utils/axios";

const AdminHotels = () => {
  const [hotels, setHotels] = useState<Hotels[]>([]);
  const [newHotel, setNewHotel] = useState<Partial<Hotels>>({});
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null);

  const fetchHotels = async () => {
    try {
      const res = await api.get("/hotels");
      setHotels(res.data);
      console.log("🚀 ~ fetchHotels ~ res.data:", res.data)
    } catch (err) {
      console.error("Klaida gaunant viešbučius:", err);
    }
  };

  useEffect(() => {
    fetchHotels();
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

      <input name="name" placeholder="Pavadinimas" value={newHotel.name || ""} onChange={handleChange} />
      <input name="location" placeholder="Vieta" value={newHotel.location || ""} onChange={handleChange} />
      <input name="pricePerNight" placeholder="Kaina už naktį" type="number" value={newHotel.pricePerNight || ""} onChange={handleChange} />
      <input name="image" placeholder="Nuotraukos URL" value={newHotel.image || ""} onChange={handleChange} />
        <input name="description" placeholder="Aprašymas" value={newHotel.description || ""} onChange={handleChange} />

      {editingHotelId ? (
        <button onClick={handleUpdate}>Atnaujinti</button>
      ) : (
        <button onClick={handleCreate}>Sukurti</button>
      )}

      <ul>
        {hotels.map(hotel => (
          <li key={hotel._id}>
            {hotel.name} - {hotel.location} - {hotel.pricePerNight} €
            <button onClick={() => startEdit(hotel)}>Redaguoti</button>
            <button onClick={() => handleDelete(hotel._id)}>Ištrinti</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminHotels;
