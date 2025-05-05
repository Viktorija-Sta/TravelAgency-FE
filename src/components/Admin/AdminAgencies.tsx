import { useEffect, useState } from "react";
import { Agencies } from "../../types/types";
import api from "../../utils/axios";
import { Link } from "react-router-dom";

const AdminAgencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agencies[]>([]);
  const [newAgency, setNewAgency] = useState<Partial<Agencies>>({
    contactInfo: { email: "", phone: "" } as Agencies["contactInfo"],
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
    if (name === "email" || name === "phone") {
      setNewAgency((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo!,
          [name]: value,
        },
      }));
    } else {
      setNewAgency((prev) => ({
        ...prev,
        [name]: name === "establishedYear" ? parseInt(value) || undefined : value,
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

      <form>
        <label>
          Pavadinimas:
          <input name="name" value={newAgency.name || ""} onChange={handleChange} />
        </label>
        <label>
          Vieta:
          <input name="location" value={newAgency.location || ""} onChange={handleChange} />
        </label>
        <label>
          Įkurimo metai:
          <input
            name="establishedYear"
            type="number"
            value={newAgency.establishedYear || ""}
            onChange={handleChange}
          />
        </label>
        <label>
          Telefonas:
          <input name="phone" value={newAgency.contactInfo?.phone || ""} onChange={handleChange} />
        </label>
        <label>
          El. paštas:
          <input name="email" value={newAgency.contactInfo?.email || ""} onChange={handleChange} />
        </label>
        <label>
          Tinklalapis:
          <input name="website" value={newAgency.website || ""} onChange={handleChange} />
        </label>
        <label>
          Logotipas (URL):
          <input name="logo" value={newAgency.logo || ""} onChange={handleChange} />
        </label>
        <label>
          Aprašymas:
          <input name="description" value={newAgency.description || ""} onChange={handleChange} />
        </label>
        <label>
          Pilnas aprašymas:
          <textarea
            name="fullDescription"
            value={newAgency.fullDescription || ""}
            onChange={handleChange}
          />
        </label>

        {editingId && (
          <p>
            Redaguojama agentūra:{" "}
            <Link to={`/agency/${editingId}`} target="_blank" rel="noopener noreferrer">
              Žiūrėti puslapį
            </Link>
          </p>
        )}

        {editingId ? (
          <button type="button" onClick={handleUpdate}>Atnaujinti</button>
        ) : (
          <button type="button" onClick={handleCreate}>Sukurti</button>
        )}
      </form>

      <ul>
        {agencies.map((agency) => (
            <li key={agency._id}>
            <Link to={`/agencies/${agency._id}`}>{agency.name}</Link> – {agency.location}
            <button onClick={() => startEdit(agency)}>Redaguoti</button>
            <button onClick={() => handleDelete(agency._id)}>Ištrinti</button>
            </li>
        ))}
        </ul>
    </div>
  );
};

export default AdminAgencies;
