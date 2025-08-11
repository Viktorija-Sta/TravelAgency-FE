import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import type { Agencies, Hotels } from "../../types/types"
import api from "../../utils/axios"
import { 
  Container, TextField, Button, Typography, Box, Grid, Card, CardContent, Select, MenuItem, InputLabel, FormControl 
} from "@mui/material"

const AdminHotels = () => {
  const [hotels, setHotels] = useState<Hotels[]>([])
  const [agencies, setAgencies] = useState<Agencies[]>([])
  const [newHotel, setNewHotel] = useState<Partial<Hotels>>({})
  const [editingHotelId, setEditingHotelId] = useState<string | null>(null)

  const fetchHotels = async () => {
    try {
      const res = await api.get("/hotels")
      setHotels(res.data)
    } catch (err) {
      console.error("Klaida gaunant viešbučius:", err)
    }
  }

  const fetchAgencies = async () => {
    try {
      const res = await api.get("/agencies")
      setAgencies(res.data)
    } catch (err) {
      console.error("Klaida gaunant agentūras:", err)
    }
  }

  useEffect(() => {
    fetchHotels()
    fetchAgencies()
  }, [])

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewHotel({ ...newHotel, [e.target.name]: e.target.value })
  }

  const handleCreate = async () => {
    try {
      await api.post("/hotels", newHotel)
      setNewHotel({})
      fetchHotels()
    } catch (err) {
      console.error("Nepavyko sukurti:", err)
    }
  }

  const updateHandler = async () => {
    if (!editingHotelId) return
    try {
      await api.put(`/hotels/${editingHotelId}`, newHotel)
      setNewHotel({})
      setEditingHotelId(null)
      fetchHotels()
    } catch (err) {
      console.error("Nepavyko atnaujinti:", err)
    }
  }

  const deleteHandler = async (id: string) => {
    try {
      await api.delete(`/hotels/${id}`)
      fetchHotels()
    } catch (err) {
      console.error("Nepavyko ištrinti:", err)
    }
  }

  const startEdit = (hotel: Hotels) => {
    setEditingHotelId(hotel._id)
    setNewHotel(hotel)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4,pb: 3}}>
      <Typography variant="h4" gutterBottom>Viešbučių valdymas</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6}}>
          <TextField 
            label="Pavadinimas" 
            name="name" 
            value={newHotel.name || ""} 
            onChange={changeHandler} 
            size="small" 
            fullWidth 
          />
          <TextField 
            label="Vieta" 
            name="location" 
            value={newHotel.location || ""} 
            onChange={changeHandler} 
            size="small" 
            fullWidth 
            sx={{ mt: 2 }}
          />
          <TextField 
            label="Kaina už naktį" 
            name="pricePerNight" 
            type="number" 
            value={newHotel.pricePerNight || ""} 
            onChange={changeHandler} 
            size="small" 
            fullWidth 
            sx={{ mt: 2 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6}}>
          <TextField 
            label="Nuotraukos URL" 
            name="image" 
            value={newHotel.image || ""} 
            onChange={changeHandler} 
            size="small" 
            fullWidth 
          />
          <TextField 
            label="Galerijos URL (atskirti kableliais)" 
            name="gallery" 
            value={Array.isArray(newHotel.gallery) ? newHotel.gallery.join(", ") : ""} 
            onChange={(e) => setNewHotel({ ...newHotel, gallery: e.target.value.split(",").map((url) => url.trim()) })} 
            size="small" 
            fullWidth 
            multiline 
          rows={4} 
            sx={{ mt: 2 }}
          />
          <TextField 
            label="Aprašymas" 
            name="description" 
            value={newHotel.description || ""} 
            onChange={changeHandler} 
            size="small" 
            fullWidth 
            multiline 
            rows={2}
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>

      <FormControl size="small" fullWidth sx={{ mb: 2 }}>
        <InputLabel>Agentūra</InputLabel>
        <Select
          name="agency"
          value={typeof newHotel.agency === "string" ? newHotel.agency : (newHotel.agency as Agencies)?._id || ""}
          onChange={(e) => {
            const selectedAgency = agencies.find(a => a._id === e.target.value)
            setNewHotel({ ...newHotel, agency: selectedAgency || undefined })
          }}
        >
          <MenuItem value="">Pasirinkite agentūrą</MenuItem>
          {agencies.map(agency => (
            <MenuItem key={agency._id} value={agency._id}>
              {agency.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" onClick={editingHotelId ? updateHandler : handleCreate} size="small">
        {editingHotelId ? "Atnaujinti" : "Sukurti"}
      </Button>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {hotels.map(hotel => (
          <Grid size={{ xs: 12, sm: 6}} key={hotel._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  <Link to={`/hotels/${hotel._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>
                    {hotel.name}
                  </Link>
                </Typography>
                <Typography variant="body1">{hotel.location} - {hotel.pricePerNight} €</Typography>
                <Box sx={{ mt: 1 }}>
                  <Button variant="outlined" color="primary" onClick={() => startEdit(hotel)} size="small" sx={{ mr: 1 }}>
                    Redaguoti
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => deleteHandler(hotel._id)} size="small">
                    Ištrinti
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default AdminHotels
