// Mock data for demonstration purposes
export interface Hostel {
  id: string
  name: string
  image: string
  location: string
  description: string
  rules: string
  amenities: string[]
  genderPolicy: "male" | "female" | "mixed"
  contactInfo: string
  availableRooms: number
  priceRange: { min: number; max: number }
}

export interface Room {
  id: string
  roomNumber: string
  roomType: "single" | "double" | "suite"
  moreInfo: string
  price: number
  isAvailable: boolean
  hostelId: string
  hostelName: string
  isSelfContained: boolean
  amenities: string[]
  image: string
}

export const mockHostels: Hostel[] = [
  {
    id: "1",
    name: "Green Valley Hostel",
    image: "/luxury-hostel-suite.jpg",
    location: "University District, Campus Road",
    description:
      "Modern hostel with excellent facilities, just 5 minutes walk from campus. Perfect for students seeking comfort and convenience.",
    rules: "No smoking, Quiet hours 10PM-7AM, Visitors allowed until 9PM",
    amenities: ["wifi", "security", "parking", "library"],
    genderPolicy: "mixed",
    contactInfo: "+256 700 123 456",
    availableRooms: 12,
    priceRange: { min: 150000, max: 350000 },
  },
  {
    id: "2",
    name: "Sunrise Student Lodge",
    image: "/elegant-student-residence.jpg",
    location: "East Campus, Academic Avenue",
    description:
      "Affordable and comfortable accommodation with a vibrant student community. Great amenities and 24/7 security.",
    rules: "No pets, Quiet hours 11PM-6AM, Guest registration required",
    amenities: ["wifi", "security", "hostel shuttle"],
    genderPolicy: "female",
    contactInfo: "+256 700 234 567",
    availableRooms: 8,
    priceRange: { min: 120000, max: 280000 },
  },
  {
    id: "3",
    name: "Campus View Residence",
    image: "/elegant-student-residence.jpg",
    location: "North Gate, University Crescent",
    description: "Premium student residence with spacious rooms and modern amenities. Ideal for serious students.",
    rules: "No smoking, No alcohol, Quiet hours 10PM-7AM",
    amenities: ["wifi", "security", "parking", "library", "hostel shuttle"],
    genderPolicy: "male",
    contactInfo: "+256 700 345 678",
    availableRooms: 15,
    priceRange: { min: 200000, max: 450000 },
  },
  {
    id: "4",
    name: "Unity Hostel",
    image: "/elegant-student-residence.jpg",
    location: "South Campus, Student Street",
    description:
      "Friendly and inclusive hostel with a diverse student community. Great social atmosphere and study spaces.",
    rules: "Respect others, Quiet hours 11PM-7AM, Visitors until 8PM",
    amenities: ["wifi", "security", "library"],
    genderPolicy: "mixed",
    contactInfo: "+256 700 456 789",
    availableRooms: 6,
    priceRange: { min: 100000, max: 250000 },
  },
  {
    id: "5",
    name: "Scholars Haven",
    image: "/elegant-student-residence.jpg",
    location: "West Campus, Knowledge Lane",
    description:
      "Quiet and conducive environment for focused studying. Well-maintained facilities and excellent management.",
    rules: "No noise, Study-friendly environment, Visitors by appointment",
    amenities: ["wifi", "security", "parking", "library"],
    genderPolicy: "mixed",
    contactInfo: "+256 700 567 890",
    availableRooms: 10,
    priceRange: { min: 180000, max: 380000 },
  },
  {
    id: "6",
    name: "Horizon Heights",
    image: "/elegant-student-residence.jpg",
    location: "Central Campus, Main Boulevard",
    description:
      "High-rise hostel with stunning views and top-notch security. Modern rooms with all essential amenities.",
    rules: "No smoking, Quiet hours 10PM-7AM, ID required for entry",
    amenities: ["wifi", "security", "parking", "hostel shuttle"],
    genderPolicy: "female",
    contactInfo: "+256 700 678 901",
    availableRooms: 20,
    priceRange: { min: 220000, max: 500000 },
  },
]

export const mockRooms: Room[] = [
  {
    id: "r1",
    roomNumber: "A101",
    roomType: "single",
    moreInfo: "Spacious single room with study desk and wardrobe",
    price: 200000,
    isAvailable: true,
    hostelId: "1",
    hostelName: "Green Valley Hostel",
    isSelfContained: true,
    amenities: ["wifi", "air conditioning", "mini fridge"],
    image: "/luxury-hostel-suite.jpg",
  },
  {
    id: "r2",
    roomNumber: "A102",
    roomType: "double",
    moreInfo: "Comfortable double room with bunk beds",
    price: 150000,
    isAvailable: true,
    hostelId: "1",
    hostelName: "Green Valley Hostel",
    isSelfContained: false,
    amenities: ["wifi", "heating"],
    image: "/luxury-hostel-suite.jpg",
  },
  {
    id: "r3",
    roomNumber: "B201",
    roomType: "suite",
    moreInfo: "Luxury suite with private bathroom and living area",
    price: 350000,
    isAvailable: true,
    hostelId: "1",
    hostelName: "Green Valley Hostel",
    isSelfContained: true,
    amenities: ["wifi", "air conditioning", "tv", "mini fridge"],
    image: "/luxury-hostel-suite.jpg",
  },
  {
    id: "r4",
    roomNumber: "C105",
    roomType: "single",
    moreInfo: "Cozy single room with natural lighting",
    price: 180000,
    isAvailable: true,
    hostelId: "2",
    hostelName: "Sunrise Student Lodge",
    isSelfContained: true,
    amenities: ["wifi", "heating"],
    image: "/luxury-hostel-suite.jpg",
  },
  {
    id: "r5",
    roomNumber: "D301",
    roomType: "double",
    moreInfo: "Shared room with study area",
    price: 120000,
    isAvailable: true,
    hostelId: "2",
    hostelName: "Sunrise Student Lodge",
    isSelfContained: false,
    amenities: ["wifi"],
    image: "/luxury-hostel-suite.jpg",
  },
]
