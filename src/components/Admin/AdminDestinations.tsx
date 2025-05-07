import { useEffect, useState } from "react"
import { Agencies, Categories, Destinations, Hotels } from "../../types/types"
import api from "../../utils/axios"
import {
  Container, TextField, Button, Typography, Box, Grid, Card, CardContent,
  Select, MenuItem, InputLabel, FormControl, Checkbox, FormControlLabel, FormGroup
} from "@mui/material"

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
      await api.post("/destinations", newDestination)
      setNewDestination({})
      fetchDestinations()
    } catch (err) {
      console.error("Nepavyko sukurti kelionės:", err)
    }
  }

  const updateHandler = async () => {
    if (!editingId) return
    try {
      await api.put(`/destinations/${editingId}`, newDestination)
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
    <Container maxWidth="md" sx={{ mt: 4, pb: 3}}>
      <Typography variant="h4" gutterBottom>Kelionių valdymas</Typography>

      <Box sx={{ mb: 4 }}>
      <Grid container spacing={2} sx={{ mb: 3}}>
          <Grid size={{ xs: 12, sm: 6}} sx={{ mb: 3}}>
            <TextField label="Pavadinimas" name="name" value={newDestination.name || ""} onChange={changeHandler} fullWidth size="small" sx={{ mb: 2}} />
            <TextField label="Vieta" name="location" value={newDestination.location || ""} onChange={changeHandler} fullWidth size="small" sx={{ mb: 2}} />
            <TextField label="Kaina" name="price" type="number" value={newDestination.price || ""} onChange={changeHandler} fullWidth size="small" sx={{ mb: 2}}/>
            <TextField label="Aprašymas" name="description" value={newDestination.description || ""} onChange={changeHandler} fullWidth size="small" multiline sx={{ mb: 2}}/>
            <TextField 
              label="Išvykimo data"
              name="departureDate"
              type="date"
              value={newDestination.departureDate || ""}
              onChange={changeHandler}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2}}
            />
            <TextField label="Trukmė (dienomis)" name="duration" type="number" value={newDestination.duration || ""} onChange={changeHandler} fullWidth size="small" sx={{ mb: 2}} />
          </Grid>

          <Grid size={{xs: 12, sm: 6}} >
            <FormControl fullWidth size="small" sx={{ mb: 1}}>
              <InputLabel>Agentūra</InputLabel>
              <Select
                name="agency"
                value={typeof newDestination.agency === "object" && newDestination.agency ? newDestination.agency._id : ""}
                onChange={(e) => {
                  const selectedAgency = agencies.find(agency => agency._id === e.target.value);
                  setNewDestination({ ...newDestination, agency: selectedAgency || undefined });
                }}
              >
                {agencies.map((agency) => (
                  <MenuItem key={agency._id} value={agency._id}>{agency.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small" sx={{ mt: 1, mb: 1}}>
              <InputLabel>Kategorija</InputLabel>
              <Select
                name="category"
                value={typeof newDestination.category === "object" && newDestination.category ? newDestination.category._id : ""}
                onChange={(e) => {
                  const selectedCategory = categories.find(category => category._id === e.target.value);
                  setNewDestination({ ...newDestination, category: selectedCategory || undefined });
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormGroup>
              {hotels.map((hotel) => (
                <FormControlLabel
                  key={hotel._id}
                  control={<Checkbox />}
                  label={hotel.name}
                />
              ))}
            </FormGroup>
          </Grid>
        </Grid>

        <Button variant="contained" onClick={editingId ? updateHandler : createHandler} size="small" sx={{ mt: 2 }}>
          {editingId ? "Atnaujinti" : "Sukurti"}
        </Button>
      </Box>

      <Grid container spacing={2}>
        {destinations.map((destination) => (
          <Grid size={{ xs: 12, sm: 6}} key={destination._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{destination.name} - {destination.price}€</Typography>
                <Button onClick={() => startEdit(destination)}>Redaguoti</Button>
                <Button onClick={() => deleteHandler(destination._id)}>Ištrinti</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

export default AdminDestinations
