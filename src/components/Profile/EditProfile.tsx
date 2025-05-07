import { useEffect, useState } from "react"
import api from "../../utils/axios"
import { UserProfile } from "../../types/types"
import { toast } from "sonner"
import { Modal, Box, TextField, Button, Typography, CircularProgress } from "@mui/material"

interface Props {
    isOpen: boolean
    onClose: () => void
    userData: UserProfile
    onUpdate: (updated: UserProfile) => void
}

const EditProfile: React.FC<Props> = ({ isOpen, onClose, userData, onUpdate }) => {
    const [formData, setFormData] = useState<UserProfile>({ ...userData })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setFormData({ ...userData })
    }, [userData])

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            const response = await api.put(`/users/${userData._id}`, formData)
            onUpdate(response.data.data)
            onClose()
            toast.success("Profilis atnaujintas sėkmingai")
        } catch {
            toast.error("Nepavyko atnaujinti profilio")
        } finally {
            setLoading(false)
        }
    }

    return (
      <Modal open={isOpen} onClose={onClose}>
      <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '80%', sm: '50%' },
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
              maxHeight: '110vh',
              overflowY: 'auto',
          }}
      >
          <Typography variant="h6" gutterBottom>
              Redaguoti profilį
          </Typography>
          <form onSubmit={submitHandler} style={{ width: '100%' }}>
              <TextField fullWidth label="Vardas" name="username" value={formData.username} onChange={changeHandler} sx={{ mb: 2 }} />
              <TextField fullWidth label="El. paštas" name="email" value={formData.email} onChange={changeHandler} sx={{ mb: 2 }} />
              <TextField fullWidth label="Telefono numeris" name="phoneNumber" value={formData.phoneNumber || ""} onChange={changeHandler} sx={{ mb: 2 }} />
              <TextField fullWidth label="Gatvė" name="address.street" value={formData.address?.street || ""} onChange={changeHandler} sx={{ mb: 2 }} />
              <TextField fullWidth label="Miestas" name="address.city" value={formData.address?.city || ""} onChange={changeHandler} sx={{ mb: 2 }} />
              <TextField fullWidth label="Pašto kodas" name="address.postalCode" value={formData.address?.postalCode || ""} onChange={changeHandler} sx={{ mb: 2 }} />
              <TextField fullWidth label="Šalis" name="address.country" value={formData.address?.country || ""} onChange={changeHandler} sx={{ mb: 2 }} />
              <Button fullWidth variant="contained" type="submit" disabled={loading} sx={{ mt: 2 }}>
                  {loading ? <CircularProgress size={24} /> : "Išsaugoti"}
              </Button>
          </form>
      </Box>
  </Modal>
)
}

export default EditProfile
