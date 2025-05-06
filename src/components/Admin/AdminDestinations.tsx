import { useEffect, useState } from "react"
import { Agencies, Categories, Destinations, Hotels } from "../../types/types"
import api from "../../utils/axios"
import { Link } from "react-router"

const AdminDestinations: React.FC = () => {
  const [destinations, setDestinations] = useState<Destinations[]>([])
  const [newDestination, setNewDestination] = useState<Partial<Destinations>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [agencies, setAgencies] = useState<Agencies[]>([])
  const [categories, setCategories] = useState<Categories[]>([])
  const [hotels, setHotels] = useState<Hotels[]>([])

  useEffect(() => {
    const fetchExtras = async () => {
      try {
        const [agenciesRes, categoriesRes, hotelsRes] = await Promise.all([
          api.get("/agencies"),
          api.get("/categories"),
          api.get("/hotels"),
        ])

        setAgencies(agenciesRes.data)
        setCategories(categoriesRes.data)
        setHotels(hotelsRes.data)
      } catch (err) {
        console.error("Nepavyko gauti duomenų:", err)
      }
    }

    fetchDestinations()
    fetchExtras()
  }, [])
  const fetchDestinations = async () => {
    try {
      const res = await api.get("/destinations")

      setDestinations(res.data)
    } catch (err) {
      console.error("Nepavyko gauti kelionių:", err)
    }
  }


  const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target

    setNewDestination({
      ...newDestination,
      [name]: name === "price" || name === "duration" ? Number(value) : value,
    })
  }

  const createHandler = async () => {
    try {
      const payload = {
        ...newDestination,
        hotels: Array.isArray(newDestination.hotels)
          ? newDestination.hotels.map((hotel) => (typeof hotel === "string" ? hotel : hotel._id))
          : [],
        agency: typeof newDestination.agency === "string" ? newDestination.agency : newDestination.agency?._id,
        category: typeof newDestination.category === "string" ? newDestination.category : newDestination.category?._id,
      }

      await api.post("/destinations", payload)

      setNewDestination({})
      fetchDestinations()
    } catch (err) {
      console.error("Nepavyko sukurti kelionės:", err)
    }
  }

  const updateHandler = async () => {
    if (!editingId) return
    try {
        const payload = {
            ...newDestination,
            hotels: Array.isArray(newDestination.hotels)
              ? newDestination.hotels.map((h) => (typeof h === "string" ? h : h._id))
              : [],
            agency: typeof newDestination.agency === "string" ? newDestination.agency : newDestination.agency?._id,
            category: typeof newDestination.category === "string" ? newDestination.category : newDestination.category?._id,
          }

      await api.put(`/destinations/${editingId}`, payload)

      setEditingId(null)
      setNewDestination({})

      fetchDestinations()
    } catch (err) {
      console.error("Nepavyko atnaujinti kelionės:", err)
    }
  }

  const deleteHandler = async (id: string) => {
    try {
      await api.delete(`/destinations/${id}`)

      fetchDestinations()
    } catch (err) {
      console.error("Nepavyko ištrinti kelionės:", err)
    }
  }

  const startEdit = (destination: Destinations) => {
    setEditingId(destination._id)
    setNewDestination(destination)
  }

  return (
    <div>
      <h2>Kelionių valdymas</h2>

      <label>
        Pavadinimas:
        <input name="name" placeholder="Pavadinimas" value={newDestination.name || ""} onChange={changeHandler} />
      </label>

      <label>
        Vieta:
        <input name="location" placeholder="Vieta" value={newDestination.location || ""} onChange={changeHandler} />
      </label>

      <label>
        Kaina:
        <input name="price" placeholder="Kaina" type="number" value={newDestination.price || ""} onChange={changeHandler} />
      </label>

      <label>
        Aprašymas:
        <input name="description" type="text" placeholder="Aprašymas" value={newDestination.description || ""} onChange={changeHandler} />
      </label>

      <label>
        Išvykimo data:
        <input type="date" name="departureDate" value={newDestination.departureDate || ""} onChange={changeHandler} />
      </label>

      <label>
        Pilnas aprašymas:
        <textarea name="fullDescription" value={newDestination.fullDescription || ""} onChange={changeHandler} />
      </label>

      <label>
        Pagrindinė nuotrauka:
        <input name="imageUrl" placeholder="Nuotraukos URL" value={newDestination.imageUrl || ""} onChange={changeHandler} />
      </label>

      <label>
        Galerijos nuotraukos (atskirti kableliais):
        <input
          name="gallery"
          placeholder="Galerijos URL (atskirti kableliais)"
          value={Array.isArray(newDestination.gallery) ? newDestination.gallery.join(", ") : ""}
          onChange={(e) =>
            setNewDestination({
              ...newDestination,
              gallery: e.target.value.split(",").map((url) => url.trim()),
            })
          }
        />
      </label>

      <label>
        Trukmė (dienomis):
        <input
          name="duration"
          type="number"
          placeholder="Trukmė"
          value={newDestination.duration || ""}
          onChange={changeHandler}
        />
      </label>

      <label>
        Agentūra:
        <select
          name="agency"
          value={typeof newDestination.agency === "string" ? newDestination.agency : newDestination.agency?._id || ""}
          onChange={(e) => {
            const selectedAgency = agencies.find((a) => a._id === e.target.value)
            setNewDestination({ ...newDestination, agency: selectedAgency || undefined })
          }}
        >
          <option value="">Pasirinkite agentūrą</option>
          {agencies.map((a) => (
            <option key={a._id} value={a._id}>{a.name}</option>
          ))}
        </select>
      </label>

      <label>
        Kategorija:
        <select
          name="category"
          value={typeof newDestination.category === "string" ? newDestination.category : newDestination.category?._id || ""}
          onChange={(e) => {
            const selectedCategory = categories.find((c) => c._id === e.target.value)
            setNewDestination({ ...newDestination, category: selectedCategory || undefined })
          }}
        >
          <option value="">Pasirinkite kategoriją</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </label>

      <div>
        <p>Pasirinkite viešbučius:</p>
        {hotels.map((hotel) => {
          const hotelId = hotel._id
          const isChecked = Array.isArray(newDestination.hotels)
            ? newDestination.hotels.some((h) => (typeof h === "string" ? h === hotelId : h._id === hotelId))
            : false

            

          return (
            <label key={hotelId} style={{ display: "block", marginBottom: "4px" }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => {
                  let updatedHotels = Array.isArray(newDestination.hotels) ? [...newDestination.hotels] : []

                  if (e.target.checked) {
                    updatedHotels.push(hotel)
                  } else {
                    updatedHotels = updatedHotels.filter(
                      (h) => (typeof h === "string" ? h : h._id) !== hotelId
                    )
                  }

                  setNewDestination({ ...newDestination, hotels: updatedHotels })
                }}
              />
              {hotel.name}
            </label>
          )
        })}
      </div>

      {editingId ? (
        <button onClick={updateHandler}>Atnaujinti</button>
      ) : (
        <button onClick={createHandler}>Sukurti</button>
      )}

      <ul>
        {destinations.map((destination) => (
          <li key={destination._id}>
            <Link to={`/destinations/${destination._id}`}>{destination.name}</Link> - {destination.location} - {destination.price}€
            <button onClick={() => startEdit(destination)}>Redaguoti</button>
            <button onClick={() => deleteHandler(destination._id)}>Ištrinti</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminDestinations