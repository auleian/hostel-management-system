import { create } from 'zustand'
import api from '@/lib/api'

export interface Room {
  _id: string
  roomNumber: string
  roomType: "single" | "double" | "suite"
  moreInfo?: string
  price: number
  isAvailable: boolean
  hostel: string | { _id: string; name: string }
  isSelfContained: boolean
  amenities: string[]
  images?: string[]
}

interface RoomState {
  rooms: Room[]
  loading: boolean
  error: string | null
  fetchRooms: (hostelId?: string) => Promise<void>
  fetchRoomById: (id: string) => Promise<Room | null>
  addRoom: (room: Room) => void
  updateRoom: (id: string, room: Partial<Room>) => void
  deleteRoom: (id: string) => void
  getRoomById: (id: string) => Room | undefined
  getRoomsByHostel: (hostelId: string) => Room[]
}

export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  loading: false,
  error: null,

  fetchRooms: async (hostelId) => {
    set({ loading: true, error: null })
    try {
      const url = hostelId ? `/rooms?hostel=${hostelId}` : '/rooms'
      const response = await api.get(url)
      set({ rooms: response.data, loading: false })
    } catch (error: any) {
      console.error('Failed to fetch rooms:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch rooms', 
        loading: false 
      })
    }
  },

  fetchRoomById: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await api.get(`/rooms/${id}`)
      const room = response.data
      
      // Update the room in the store if it exists, or add it
      set((state) => {
        const existingIndex = state.rooms.findIndex(r => r._id === id)
        if (existingIndex >= 0) {
          const updatedRooms = [...state.rooms]
          updatedRooms[existingIndex] = room
          return { rooms: updatedRooms, loading: false }
        } else {
          return { rooms: [...state.rooms, room], loading: false }
        }
      })
      
      return room
    } catch (error: any) {
      console.error('Failed to fetch room:', error)
      set({ 
        error: error.response?.data?.message || 'Failed to fetch room', 
        loading: false 
      })
      return null
    }
  },

  addRoom: (room) => {
    set((state) => ({
      rooms: [...state.rooms, room]
    }))
  },

  updateRoom: (id, updatedRoom) => {
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room._id === id ? { ...room, ...updatedRoom } : room
      )
    }))
  },

  deleteRoom: (id) => {
    set((state) => ({
      rooms: state.rooms.filter((room) => room._id !== id)
    }))
  },

  getRoomById: (id) => {
    return get().rooms.find((room) => room._id === id)
  },

  getRoomsByHostel: (hostelId) => {
    return get().rooms.filter((room) => {
      if (typeof room.hostel === 'string') {
        return room.hostel === hostelId
      }
      return room.hostel._id === hostelId
    })
  },
}))
