import { create } from 'zustand'
import api from '@/lib/api'

export interface Hostel {
  _id: string
  name: string
  images?: string[]
  location: string
  description: string
  rules: string
  amenities: string[]
  genderPolicy: "male" | "female" | "mixed"
  contactInfo: string
  availableRooms?: number
  priceRange?: { min: number; max: number }
}

interface HostelState {
  hostels: Hostel[]
  loading: boolean
  error: string | null
  fetchHostels: () => Promise<void>
  addHostel: (hostel: Hostel) => void
  updateHostel: (id: string, hostel: Partial<Hostel>) => void
  deleteHostel: (id: string) => void
  getHostelById: (id: string) => Hostel | undefined
}

export const useHostelStore = create<HostelState>((set, get) => ({
  hostels: [],
  loading: false,
  error: null,

  fetchHostels: async () => {
    set({ loading: true, error: null })
    try {
      const response = await api.get('/hostels')
      set({ hostels: response.data, loading: false })
    } catch (error: any) {
      console.error('Failed to fetch hostels:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch hostels', 
        loading: false 
      })
    }
  },

  addHostel: (hostel) => {
    set((state) => ({
      hostels: [...state.hostels, hostel]
    }))
  },

  updateHostel: (id, updatedHostel) => {
    set((state) => ({
      hostels: state.hostels.map((hostel) =>
        hostel._id === id ? { ...hostel, ...updatedHostel } : hostel
      )
    }))
  },

  deleteHostel: (id) => {
    set((state) => ({
      hostels: state.hostels.filter((hostel) => hostel._id !== id)
    }))
  },

  getHostelById: (id) => {
    return get().hostels.find((hostel) => hostel._id === id)
  },
}))
