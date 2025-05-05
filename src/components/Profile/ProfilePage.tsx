import { useEffect, useState } from "react"
import { useAuth } from "../../hooks/useAuth"
import api from "../../utils/axios"
import { UserProfile } from "../../types/types"
import EditProfile from "./EditProfile";
import './EditProfile.scss'

const ProfilePage = () => {
    const { user } = useAuth()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
  
    useEffect(() => {
        
      
        if (!user) {
          setError("Turite būti prisijungęs norėdami matyti profilį");
          setLoading(false);
          return;
        }
      
        const fetchProfile = async () => {
          try {
            const response = await api.get("/users/me");
            setProfile(response.data);
          } catch {
            setError("Nepavyko gauti naudotojo informacijos");
          } finally {
            setLoading(false);
          }
        };
      
        fetchProfile();
      }, [user, loading])

      const handleProfileUpdate = (updated: UserProfile) => {
        setProfile(updated)
      }
  
    if (loading) return <div>Kraunama...</div>;
    if (error) return <div>{error}</div>;
  
    return (
      <>
          
          <div className="profile-page">
          <h2>Naudotojo profilis</h2>
          {profile && (
              <div className="profile-card">
              <img
                  src={profile.profilePicture}
                  alt="Profilio nuotrauka"
                  className="profile-image"
              />
              <p><strong>Vardas:</strong> {profile.username}</p>
              <p><strong>El. paštas:</strong> {profile.email}</p>
              <p><strong>Telefono numeris:</strong> {profile.phoneNumber}</p>

              {profile.role === "admin" && (
                <p><strong>Rolė:</strong> {profile.role}</p>
              )}

              {profile.address && (
                <div className="address-section">
                  <p><strong>Adresas:</strong></p>
                  <p>
                    {profile.address.country && `${profile.address.country}, `}
                    {profile.address.city && `${profile.address.city}, `}
                    {profile.address.street && `${profile.address.street}, `}
                    {profile.address.postalCode && `LT-${profile.address.postalCode}`}
                  </p>
                </div>
              )}

              </div>
          )}
          
          <button onClick={() => setIsModalOpen(true)}>Redaguoti profilį</button>
          {profile && (
            <EditProfile
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              userData={profile}
              onUpdate={handleProfileUpdate}
            />
          )}
  
          </div>
      </>
    );
  };
  
  export default ProfilePage;
  
