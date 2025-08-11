import { useEffect, useState } from "react"
import type { Agencies } from "../../types/types"
import api from "../../utils/axios"
import { Link } from "react-router-dom"
import {
  Container, TextField, Button, Typography, Box, Grid, Card, CardContent
} from "@mui/material"

const AdminAgencies: React.FC = () => {
  const [agencies, setAgencies] = useState<Agencies[]>([])
  const [newAgency, setNewAgency] = useState<Partial<Agencies>>({
    contactInfo: { email: "", phone: "" } as Agencies["contactInfo"],
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAgencies()
  }, [])

  const fetchAgencies = async () => {
    try {
      const res = await api.get("/agencies")
      setAgencies(res.data)
    } catch (err) {
      console.error("Nepavyko gauti agentūrų:", err)
    }
  }

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "email" || name === "phone") {
      setNewAgency((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo!,
          [name]: value,
        },
      }))
    } else {
      setNewAgency((prev) => ({
        ...prev,
        [name]: name === "establishedYear" ? parseInt(value) || undefined : value,
      }))
    }
  }

  const createHandler = async () => {
    try {
      await api.post("/agencies", newAgency)
      setNewAgency({ contactInfo: { email: "", phone: "" } })
      fetchAgencies()
    } catch (err) {
      console.error("Nepavyko sukurti agentūros:", err)
    }
  }

  const updateHandler = async () => {
    if (!editingId) return
    try {
      await api.put(`/agencies/${editingId}`, newAgency)
      setEditingId(null)
      setNewAgency({ contactInfo: { email: "", phone: "" } })
      fetchAgencies()
    } catch (err) {
      console.error("Nepavyko atnaujinti agentūros:", err)
    }
  }

  const deleteHandler = async (id: string) => {
    try {
      await api.delete(`/agencies/${id}`)
      fetchAgencies()
    } catch (err) {
      console.error("Nepavyko ištrinti agentūros:", err)
    }
  }

  const startEdit = (agency: Agencies) => {
    setEditingId(agency._id)
    setNewAgency({
      ...agency,
      contactInfo: {
        email: agency.contactInfo?.email || "",
        phone: agency.contactInfo?.phone || "",
      },
    })
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4,pb: 3}}>
      <Typography variant="h4" gutterBottom>Agentūrų valdymas</Typography>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="Pavadinimas" name="name" value={newAgency.name || ""} onChange={changeHandler} fullWidth size="small" />
          <TextField label="Vieta" name="location" value={newAgency.location || ""} onChange={changeHandler} fullWidth size="small" sx={{ mt: 2 }} />
          <TextField label="Įkurimo metai" name="establishedYear" type="number" value={newAgency.establishedYear || ""} onChange={changeHandler} fullWidth size="small" sx={{ mt: 2 }} />
          <TextField label="Telefonas" name="phone" value={newAgency.contactInfo?.phone || ""} onChange={changeHandler} fullWidth size="small" sx={{ mt: 2 }} />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField label="El. paštas" name="email" value={newAgency.contactInfo?.email || ""} onChange={changeHandler} fullWidth size="small" />
          <TextField label="Tinklalapis" name="website" value={newAgency.website || ""} onChange={changeHandler} fullWidth size="small" sx={{ mt: 2 }} />
          <TextField label="Logotipas (URL)" name="logo" value={newAgency.logo || ""} onChange={changeHandler} fullWidth size="small" sx={{ mt: 2 }} />
          <TextField label="Aprašymas" name="description" value={newAgency.description || ""} onChange={changeHandler} fullWidth size="small" sx={{ mt: 2 }} />
        </Grid>
      </Grid>

      <TextField
        label="Pilnas aprašymas"
        name="fullDescription"
        value={newAgency.fullDescription || ""}
        onChange={changeHandler}
        fullWidth
        size="small"
        multiline
        rows={3}
        sx={{ mb: 2 }}
      />

      <Button variant="contained" onClick={editingId ? updateHandler : createHandler} size="small" sx={{ mb: 3 }}>
        {editingId ? "Atnaujinti" : "Sukurti"}
      </Button>

      <Grid container spacing={2}>
        {agencies.map((agency) => (
          <Grid size={{ xs: 12, sm: 6 }} key={agency._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  <Link to={`/agencies/${agency._id}`} style={{ textDecoration: "none", color: "#1976d2" }}>
                    {agency.name}
                  </Link>
                </Typography>
                <Typography variant="body1">{agency.location} - {agency.contactInfo?.phone}</Typography>
                <Box sx={{ mt: 1 }}>
                  <Button variant="outlined" color="primary" onClick={() => startEdit(agency)} size="small" sx={{ mr: 1 }}>
                    Redaguoti
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => deleteHandler(agency._id)} size="small">
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

export default AdminAgencies
