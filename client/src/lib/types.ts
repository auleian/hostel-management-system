export interface Hostel {
  id: string
  name: string
  location: string
  description: string
  image?: string
  availableRooms: number
  genderPolicy: "male" | "female" | "mixed"
  amenities: string[]
  priceRange: {
    min: number
    max: number
  }
}

export interface Room {
  id: string
  hostelId: string
  type: "single" | "double" | "shared"
  price: number
  isAvailable: boolean
  amenities: string[]
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "student" | "admin"
}

export interface Booking {
  id: string
  userId: string
  hostelId: string
  roomId: string
  startDate: string
  endDate: string
  status: "pending" | "confirmed" | "cancelled"
  totalAmount: number
}