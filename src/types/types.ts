export interface AuthState {
  user: User | null
}

export type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }


  export interface CartItem {
      _id: string
      name: string
      price: number
      quantity: number
      image?: string
      createdAt?: string
    }
    
  
    
    export type CartAction =
    | { type: "ADD_ITEM"; payload: CartItem }
    | { type: "REMOVE_ITEM"; payload: string }
    | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
    | { type: "CLEAR_CART" }      


export interface User {
    _id: string
    username: string
    email: string
    role: 'user' | 'admin'
    token: string
  }  

  export interface UserProfile {
    _id: string  
    username: string
    email: string
    phoneNumber: string
    role: string
    profilePicture: string
    address?: {
      street?: string  
      city?: string
      postalCode?: string
      country?: string
    }  
    orders?: string[]
  }  
  

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
    duration: number
    departureDate: string
    category: Categories
    agency: Agencies
    reviewCount?: number
    averageRating?: number
    reviews?: Reviews[]
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
    website: string
    fullDescription: string
    establishedYear: number
    contactInfo: {
            email: string
            phone: string
    }
    reviewCount?: number
    averageRating?: number
    reviews?: Reviews[]
    destinations?: Destinations[]
    hotels?: Hotels[]
    categories?: Categories[]
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
    averageRating: number
    destination: Destinations
    category: Categories
    agency: Agencies
    gallery: string[]
    image: string
}

export interface Reviews {
    _id: string
    user: {
        username: string
    }
    comment: string
    rating: number
    destination?: {
         _id: string
          name: string 
    } | string
    hotel?: { 
        _id: string
        name: string
     } | string
    agency?: {
        _id: string
        name: string
    } | string
}


export interface Order {
    _id: string
    user: User
    items: CartItem[]
    totalAmount: number
    orderDate: string
    status: string
    createdAt: string
  }
