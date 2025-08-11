import { useState } from "react"
import api from "../../utils/axios"
import type { Reviews } from "../../types/types"
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Alert,
  Rating
} from "@mui/material"
import { useAuth } from "../../hooks/useAuth"

interface ReviewFormProps {
  destinationId?: string
  hotelId?: string
  agencyId?: string
  onReviewSubmitted?: (newReview: Reviews) => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({ destinationId, hotelId, agencyId, onReviewSubmitted }) => {
  const { user } = useAuth()
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitHandler = async (_e: React.FormEvent) => {
    _e.preventDefault()

    if (!rating || rating < 1 || rating > 5) {
      setError("Įvertinimas turi būti nuo 1 iki 5")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await api.post("/reviews", {
        rating,
        comment,
        destination: destinationId,
        hotel: hotelId,
        agency: agencyId,
        user: user ? user._id : null,
      })

      const reviewWithUser: Reviews = {
        ...response.data.review,
        user: response.data.review.user || { username: user ? user.username : "Anonimas" }
      }

      if (onReviewSubmitted) {
        onReviewSubmitted(reviewWithUser)
      }

      setComment("")
      setRating(5)
    } catch {
      setError("Nepavyko pateikti atsiliepimo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={submitHandler}
      sx={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: 2,  
        margin: "auto", 
        padding: 3, 
        border: "1px solid #ddd", 
        borderRadius: 2 
      }}
    >
      <Typography variant="h6" gutterBottom>Parašykite atsiliepimą</Typography>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Typography variant="body1">Įvertinimas:</Typography>
        <Rating
          name="review-rating"
          value={rating}
          onChange={(_event, newValue) => setRating(newValue || 5)}
        />
      </Box>

      <TextField
        label="Komentaras"
        multiline
        rows={4}
        variant="outlined"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Pasidalinkite įspūdžiais..."
        fullWidth
      />

      <Button 
        type="submit" 
        variant="contained" 
        color="primary" 
        disabled={loading}
        fullWidth
        sx={{ marginTop: 2 }}
      >
        {loading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Pateikti"
        )}
      </Button>
    </Box>
  )
}

export default ReviewForm
