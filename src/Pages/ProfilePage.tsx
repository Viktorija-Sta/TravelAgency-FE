import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../utils/axios";
import { UserProfile } from "../types/types";

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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

    if (isAuthenticated && user) {
      fetchProfile()
    } else {
      setError("Turite būti prisijungęs norėdami matyti profilį")
      setLoading(false)
    }
  }, [user, isAuthenticated])

  if (authLoading || loading) return <div>Kraunama...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="profile-page">
      <h2>Naudotojo profilis</h2>
      {profile && (
        <div className="profile-card">
          <img
            src={`/images/${profile.profilePicture}`}
            alt="Profilio nuotrauka"
            className="profile-image"
          />
          <p><strong>Vardas:</strong> {profile.username}</p>
          <p><strong>El. paštas:</strong> {profile.email}</p>
          <p><strong>Telefono numeris:</strong> {profile.phoneNumber}</p>
          <p><strong>Rolė:</strong> {profile.role}</p>
          {profile.address && (
            <div>
              <p><strong>Adresas:</strong></p>
              <p>{profile.address.street}, {profile.address.city}</p>
              <p>{profile.address.postalCode}, {profile.address.country}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfilePage
