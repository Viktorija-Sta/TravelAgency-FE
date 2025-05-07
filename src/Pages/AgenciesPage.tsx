import { useEffect, useState } from "react"
import { Agencies, Reviews } from "../types/types"
import api from "../utils/axios"
import AgencyCard from "../components/Card/AgencyCard"
import { CircularProgress, Container, Grid, Typography } from "@mui/material"
import "./AgenciesPage.scss"

const AgenciesPage: React.FC = () => {
  const [agencies, setAgencies] = useState<Agencies[]>([])
  const [reviews, setReviews] = useState<Reviews[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agenciesRes, reviewsRes] = await Promise.all([
          api.get("/agencies"),
          api.get("/reviews"),
        ])

        setAgencies(agenciesRes.data)
        setReviews(reviewsRes.data)
      } catch {
        setError("Nepavyko gauti agentūrų arba atsiliepimų")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return (
    <Container maxWidth="md" sx={{ textAlign: "center", marginTop: 4 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ marginTop: 2 }}>Kraunama...</Typography>
    </Container>
  )
  if (error) return <Typography color="error">{error}</Typography>

  return (
    <Container className="agencies-page" maxWidth="lg" sx={{ paddingX: { xs: 2, sm: 3, md: 4 }, paddingY: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Kelionių Agentūrų Sąrašas
      </Typography>

      <Grid container spacing={1} className="destination-list" marginTop={2}>
        {agencies.map((agency) => {
          const relatedReviews = reviews.filter((review) => {
            const reviewAgencyId =
              typeof review.agency === "string"
                ? review.agency
                : review.agency?._id

            return reviewAgencyId === agency._id
          })

          const averageRating =
            relatedReviews.length > 0
              ? relatedReviews.reduce((acc, r) => acc + r.rating, 0) / relatedReviews.length
              : 0

          return (
            <Grid  key={agency._id} size={{ xs: 11, sm: 6, md: 4, lg: 4}}>
              <AgencyCard
                agency={agency}
                averageRating={averageRating}
                reviewCount={relatedReviews.length}
              />
            </Grid>
          )
        })}
      </Grid>
    </Container>
  )
}

export default AgenciesPage
