import api from "../utils/axios"

export const getDestinationsByCategory = async (categoryId: string) => {
    try {
        const response = await api.get(`/destinations?category=${categoryId}`)

        return response.data
    } catch (error) {
        console.error("Error fetching destinations by category:", error)
        return []
    }
}

export const getAllDestinations = async () => {
    try {
        const response = await api.get("/destinations")

        return {data: response.data}
    } catch (error) {
        console.error("Error fetching all destinations:", error)
        return { data: [] }
    }
}

export const getDestinationById = async (id: string) => {
    try {
        const response = await api.get(`/destinations/${id}`)
        
        return response.data
    } catch (error) {
        console.error("Error fetching destination by ID:", error)
        return null
    }
}



