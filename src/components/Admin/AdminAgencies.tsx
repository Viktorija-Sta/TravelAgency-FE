import { useEffect, useState } from "react";
import { Agencies } from "../../types/types";
import api from "../../utils/axios";

const AdminAgencies = () => {
  const [agencies, setAgencies] = useState<Agencies[]>([]);
  const [newAgency, setNewAgency] = useState<Partial<Agencies>>({
    contactInfo: { email: "", phone: "" },
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const res = await api.get("/agencies");
      setAgencies(res.data);
    } catch (err) {
      console.error("Nepavyko gauti agentūrų:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Specialus tvarkymas kontaktinei informacijai
    if (name === "email" || name === "phone") {
      setNewAgency((prev) => ({
        ...prev,
        contactInfo: {
          email: prev.contactInfo?.email || "",
          phone: prev.contactInfo?.phone || "",
          [name]: value,
        },
      }));
    } else {
      setNewAgency((prev) => ({
        ...prev,
        [name]: name === "establishedYear" ? Number(value) : value,
      }));
    }
  };

  const handleCreate = async () => {
    try {
      await api.post("/agencies", newAgency);
      setNewAgency({ contactInfo: { email: "", phone: "" } });
      fetchAgencies();
    } catch (err) {
      console.error("Nepavyko sukurti agentūros:", err);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      await api.put(`/agencies/${editingId}`, newAgency);
      setEditingId(null);
      setNewAgency({ contactInfo: { email: "", phone: "" } });
      fetchAgencies();
    } catch (err) {
      console.error("Nepavyko atnaujinti agentūros:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/agencies/${id}`);
      fetchAgencies();
    } catch (err) {
      console.error("Nepavyko ištrinti agentūros:", err);
    }
  };

  const startEdit = (agency: Agencies) => {
    setEditingId(agency._id);
    setNewAgency({
      ...agency,
      contactInfo: {
        email: agency.contactInfo?.email || "",
        phone: agency.contactInfo?.phone || "",
      },
    });
  };

  return (
    <div>
      <h2>Agentūrų valdymas</h2>

      <input name="name" placeholder="Pavadinimas" value={newAgency.name || ""} onChange={handleChange} />
      <input name="location" placeholder="Vieta" value={newAgency.location || ""} onChange={handleChange} />
      <input
        name="establishedYear"
        type="number"
        placeholder="Įkurimo metai"
        value={newAgency.establishedYear || ""}
        onChange={handleChange}
      />
      <input name="phone" placeholder="Telefonas" value={newAgency.contactInfo?.phone || ""} onChange={handleChange} />
      <input name="email" placeholder="El. paštas" value={newAgency.contactInfo?.email || ""} onChange={handleChange} />
      <input name="website" placeholder="Tinklalapis" value={newAgency.website || ""} onChange={handleChange} />
      <input name="logo" placeholder="Logotipas (URL)" value={newAgency.logo || ""} onChange={handleChange} />
      <input name="description" placeholder="Aprašymas" value={newAgency.description || ""} onChange={handleChange} />
      <textarea
        name="fullDescription"
        placeholder="Pilnas Aprašymas"
        value={newAgency.fullDescription || ""}
        onChange={handleChange}
      ></textarea>

      {editingId ? (
        <button onClick={handleUpdate}>Atnaujinti</button>
      ) : (
        <button onClick={handleCreate}>Sukurti</button>
      )}

      <ul>
        {agencies.map((agency) => (
          <li key={agency._id}>
            {agency.name} – {agency.location}
            <button onClick={() => startEdit(agency)}>Redaguoti</button>
            <button onClick={() => handleDelete(agency._id)}>Ištrinti</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminAgencies;
