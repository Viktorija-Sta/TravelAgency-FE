import { useEffect, useState } from "react"
import api from "../../utils/axios"
import { UserProfile } from "../../types/types"

interface Props {
    isOpen: boolean
    onClose: () => void
    userData: UserProfile
    onUpdate: (updated: UserProfile) => void
  }
  
  const EditProfile: React.FC<Props> = ({ isOpen, onClose, userData, onUpdate }) => {
    const [formData, setFormData] = useState<UserProfile>(userData)
  
    useEffect(() => {
      setFormData(userData)
    }, [userData])
  
    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target

      if (name.startsWith("address.")) {
        const key = name.split(".")[1]
        setFormData((prev) => ({
          ...prev,
          address: { ...prev.address, [key]: value }
        }))

      } else {
        setFormData((prev) => ({ ...prev, [name]: value }))
      }
    }
  
    const submitHandler = async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        const response = await api.put(`/users/${userData._id}`, formData)
        
        onUpdate(response.data.data)
        onClose()
      } catch {
        alert("Nepavyko atnaujinti profilio")
      }
    }
  
    if (!isOpen) return null
  
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <h2>Redaguoti profilį</h2>
          <form onSubmit={submitHandler}>
            <input name="username" value={formData.username} onChange={changeHandler} placeholder="Vardas" />
            <input name="email" value={formData.email} onChange={changeHandler} placeholder="El. paštas" />
            <input name="phoneNumber" value={formData.phoneNumber} onChange={changeHandler} placeholder="Telefono numeris" />
            <input name="address.street" value={formData.address?.street || ""} onChange={changeHandler} placeholder="Gatvė" />
            <input name="address.city" value={formData.address?.city || ""} onChange={changeHandler} placeholder="Miestas" />
            <input name="address.postalCode" value={formData.address?.postalCode || ""} onChange={changeHandler} placeholder="Pašto kodas" />
            <input name="address.country" value={formData.address?.country || ""} onChange={changeHandler} placeholder="Šalis" />
            <button type="submit">Išsaugoti</button>
            <button type="button" onClick={onClose}>Atšaukti</button>
          </form>
        </div>
      </div>
    )
  }
  
  export default EditProfile