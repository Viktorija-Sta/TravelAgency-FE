
export interface User {
    _id: string
    username: string
    email: string
    role: 'user' | 'admin'
    token: string
  }
  
  export interface AuthState {
    user: User | null
  }
  
  export type AuthAction =
    | { type: 'LOGIN'; payload: User }
    | { type: 'LOGOUT' }
  

    export interface CartItem {
        _id: string
        username: string
        price: number
        quantity: number
        image?: string;
      }
      
    
      
      export type CartAction =
      | { type: "ADD_ITEM"; payload: CartItem }
      | { type: "REMOVE_ITEM"; payload: string }
      | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
      | { type: "CLEAR_CART" }      


export interface Destinations {
    _id: string
    name: string
    description: string
    fullDescription: string
    price: number
    location: string
    imageUrl: string
    gallery: string[]
    rating: number
    category: Categories
    agency: Agencies
}

export interface Categories {
    _id: string
    name: string
}

export interface Agencies {
    _id: string
    name: string
    location: string
    description: string
    logo: string
    rating: number
    contactInfo: {
            email: string
            phone: string
    }
}

export interface Hotels {
    _id: string
    name: string
    location: string
    description: string
    pricePerNight: number
    amenities: string[]
    rating: number
    reviewsCount: number
    destination: Destinations
    category: Categories
    agency: Agencies
}