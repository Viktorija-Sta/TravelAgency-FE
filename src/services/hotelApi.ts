import api from "../utils/axios"

export const getHotelsByDestination = async (destinationId: string) => {
    try {
        const response = await api.get(`/hotels?destination=${destinationId}`)
        return response.data
    } catch (error) {
        console.error("Error fetching hotels by destination:", error)
        return []
    }
}

export const getAllHotels = async () => {
    try {
        const response = await api.get("/hotels")
        return {data: response.data}
    } catch (error) {
        console.error("Error fetching all hotels:", error)
        return { data: [] }
    }
}

export const getHotelById = async (id: string) => {
    try {
        const response = await api.get(`/hotels/${id}`)
        return response.data
    } catch (error) {
        console.error("Error fetching hotel by ID:", error)
        return null
    }
}

