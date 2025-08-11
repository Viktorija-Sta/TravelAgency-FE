import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import api from "../../utils/axios"
import type { UserProfile } from "../../types/types"
import EditProfile from "./EditProfile"
import { Container, Typography, Button, Avatar, CircularProgress, Alert, Box } from "@mui/material"

const ProfilePage: React.FC = () => {
    const { user } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        if (!user) {
            setError("Turite būti prisijungęs norėdami matyti profilį")
            setLoading(false)
            return
        }

        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/me")
                setProfile(response.data)
            } catch {
                setError("Nepavyko gauti naudotojo informacijos")
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user])

    const profileUpdateHandler = (updated: UserProfile) => {
        setProfile(updated)
    }

    if (loading) return (
        <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
        </Box>
    )

    if (error) return (
        <Container maxWidth="sm" sx={{ textAlign: "center", marginTop: 4 }}>
            <Alert severity="error">{error}</Alert>
        </Container>
    )

    return (
      <Container maxWidth="sm" sx={{ marginTop: 4, pb: 4 }}>
      <Typography variant="h4" gutterBottom>Naudotojo profilis</Typography>
      {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress />
              <Typography variant="h6" sx={{ mt: 2 }}>Kraunama...</Typography>
          </Box>
      ) : error ? (
          <Alert severity="error">{error}</Alert>
      ) : profile && (
          <Box sx={{ textAlign: "center", mb: 3 }}>
              <Avatar src={profile.profilePicture} alt="Profilio nuotrauka" sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
              <Typography variant="h6">{profile.username}</Typography>
              <Typography>Email: {profile.email}</Typography>
              <Typography>Telefono numeris: {profile.phoneNumber || "Nenurodytas"}</Typography>
              {profile.role === "admin" && (
                  <Typography>Rolė: {profile.role}</Typography>
              )}
              {profile.address && (
                  <Typography>
                      Adresas: {profile.address.street}, {profile.address.city}, {profile.address.country}, LT-{profile.address.postalCode}
                  </Typography>
              )}
              <Button variant="contained" onClick={() => setIsModalOpen(true)} sx={{ mt: 2 }}>
                  Redaguoti profilį
              </Button>
              {profile && (
                  <EditProfile
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      userData={profile}
                      onUpdate={profileUpdateHandler}
                  />
              )}
          </Box>
      )}
  </Container>
)
}

export default ProfilePage