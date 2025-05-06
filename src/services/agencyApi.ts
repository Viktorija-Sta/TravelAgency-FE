import api from "../utils/axios"

export const getAgencies = async () => {
    try {
        const response = await api.get("/agencies")

        return { data: response.data }
    } catch (error) {
        console.error("Error fetching all agencies:", error)
        return { data: [] }
    }
}

export const getAgencyById = async (id: string) => {
    try {
        const response = await api.get(`/agencies/${id}`)

        return response.data
    } catch (error) {
        console.error("Error fetching agency by ID:", error)
        return null
    }
}

export const getAgencyByHotels = async (hotelId: string) => {
    try {
        const response = await api.get(`/agencies?hotel=${hotelId}`)

        return response.data
    } catch (error) {
        console.error("Error fetching agency by hotel:", error)
        return null
    }
}

export const getAgencyByDestination = async (destinationId: string) => {
    try {
        const response = await api.get(`/agencies?destination=${destinationId}`)
        
        return response.data
    } catch (error) {
        console.error("Error fetching agency by destination:", error)
        return null
    }
}