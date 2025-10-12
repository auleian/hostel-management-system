export interface Hostel {
  _id: string
  name: string
  location: string
  description: string
  image?: string
  images?: string[]
  availableRooms: number
  genderPolicy: "male" | "female" | "mixed"
  amenities: string[]
  //price?: number
  priceRange?: { min: number; max: number }
}

export interface Room {
  _id: string
  hostelId: string
  type: "single" | "double" | "shared"
  price: number
  isAvailable: boolean
  amenities: string[]
  images?: string[]
  roomNumber: string
  isSelfContained: boolean
  createdAt?: string
  createdBy?: string
  hostel: string
  moreInfo: string
  roomType: "single" | "double" | "suite"
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: "student" | "admin"
}

export interface Booking {
  _id: string
  userId: string
  hostelId: string
  roomId: string
  startDate: string
  endDate: string
  status: "pending" | "confirmed" | "cancelled"
  totalAmount: number
}