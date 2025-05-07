import { useEffect, useState } from "react"
import { Agencies, Categories, Destinations, Hotels } from "../../types/types"
import api from "../../utils/axios"
import { Link } from "react-router"
import { Box, Button, Card, CardContent, Checkbox, Container, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"

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
    <Container maxWidth="md" sx={{ mt: 4,pb: 3}}>
      <Typography variant="h4" gutterBottom>Kelionių valdymas</Typography>

      <Grid 
        container 
        spacing={2} 
        sx={{ mb: 4 }}>

        <Grid  size={{ xs: 12, sm: 6 }}>

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small" 
          name="name" 
          placeholder="Pavadinimas"
          value={newDestination.name || ""} onChange={changeHandler} />

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small" 
          name="location" 
          placeholder="Vieta" 
          value={newDestination.location || ""} onChange={changeHandler} />

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small" 
          name="price" 
          placeholder="Kaina" 
          type="number" 
          value={newDestination.price || ""} onChange={changeHandler} />

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small" 
          name="description" 
          type="text" 
          placeholder="Aprašymas" 
          value={newDestination.description || ""} onChange={changeHandler} />

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small" 
          type="date" 
          name="departureDate" 
          value={newDestination.departureDate || ""} onChange={changeHandler} />

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small" 
          multiline 
          rows={4} 
          name="fullDescription" 
          value={newDestination.fullDescription || ""} onChange={changeHandler} />
      </Grid>

       <Grid size={{ xs: 12, sm: 6 }}>

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small" 
          name="imageUrl" 
          placeholder="Nuotraukos URL" 
          value={newDestination.imageUrl || ""} onChange={changeHandler} />

        <TextField
          sx={{ mt: 2 }} 
          fullWidth 
          size="small" 
          multiline 
          rows={4} 
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

        <TextField 
          sx={{ mt: 2 }}
          fullWidth 
          size="small"
          name="duration"
          type="number"
          placeholder="Trukmė (dienomis)"
          value={newDestination.duration || ""}
          onChange={changeHandler}
        />

      <FormControl size="small" fullWidth sx={{ mt: 2 }}>
        <InputLabel>Agentūra</InputLabel>
        <Select
          name="agency"
          value={typeof newDestination.agency === "string" ? newDestination.agency : (newDestination.agency as Agencies)?._id || ""}
          onChange={(e) => {
            const selectedAgency = agencies.find(a => a._id === e.target.value)
            setNewDestination({ ...newDestination, agency: selectedAgency || undefined })
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

      <FormControl size="small" fullWidth sx={{ mt: 2 }}>
        <InputLabel>Kategorija</InputLabel>
        <Select 
          name="category"
          value={typeof newDestination.category === "string" ? newDestination.category : newDestination.category?._id || ""}
          onChange={(e) => {
            const selectedCategory = categories.find((c) => c._id === e.target.value)
            setNewDestination({ ...newDestination, category: selectedCategory || undefined })
          }}
        >
          <MenuItem value="">Pasirinkite kategoriją</MenuItem>
          {categories.map(category => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>

      </FormControl>

        </Grid>
      </Grid>

      <FormGroup sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Pasirinkite viešbučius:</Typography>
        {hotels.map((hotel) => {
          const hotelId = hotel._id
          const isChecked = Array.isArray(newDestination.hotels)
        ? newDestination.hotels.some((h) => (typeof h === "string" ? h === hotelId : h._id === hotelId))
        : false

      return (
        <FormControlLabel
          key={hotelId}
          control={
            <Checkbox
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
          }
          label={hotel.name}
        />
          )
        })}
      </FormGroup>

      <Button variant="contained" onClick={editingId ? updateHandler : createHandler} size="small" sx={{ mb: 3 }}>
        {editingId ? "Atnaujinti" : "Sukurti"}
      </Button>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {destinations.map(destination => (
          <Grid size={{ xs: 12, sm: 6}} key={destination._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">

                  <Link to={`/destinations/${destination._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>
                    {destination.name}
                  </Link>

                </Typography>

                <Typography variant="body1">{destination.location} - {destination.price} €</Typography>
                <Box sx={{ mt: 1 }}>

                  <Button variant="outlined" color="primary" onClick={() => startEdit(destination)} size="small" sx={{ mr: 1 }}>
                    Redaguoti
                  </Button>

                  <Button variant="outlined" color="error" onClick={() => deleteHandler(destination._id)} size="small">
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

export default AdminDestinations
