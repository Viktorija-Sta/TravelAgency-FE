import api from "../utils/axios"

export const getDestinationsByCategory = async (category: string) => {
    try {
        const response = await api.get(`/destinations?category=${category}`)
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

// export const createDestination = async (destinationData: any) => {
//     try {
//         const response = await api.post("/destinations", destinationData)
//         return response.data
//     } catch (error) {
//         console.error("Error creating destination:", error)
//         return null
//     }
// }

// export const updateDestination = async (id: string, destinationData: any) => {
//     try {
//         const response = await api.put(`/destinations/${id}`, destinationData)
//         return response.data
//     } catch (error) {
//         console.error("Error updating destination:", error)
//         return null
//     }
// }

