import Hostel from '../models/hostelModel.js'
import Room from '../models/roomModel.js'


//get all hostels
export const getHostels = async (req, res) => {
  try {
    const { name, minPrice, maxPrice } = req.query
    let filter = {}

    if (name) filter.name = { $regex: name, $options: 'i' }
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) }
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) }

    const hostels = await Hostel.find(filter)
    const hostelsWithPriceRange = await Promise.all(hostels.map(async h => {
      const hostel = h.toObject()
      const rooms = await Room.find({ hostel: hostel._id })

      if (rooms.length > 0) {
        const prices = rooms.map(r => r.price)
        hostel.priceRange = {
          min: Math.min(...prices),
          max: Math.max(...prices)
        }
      } else {
        hostel.priceRange = { min: null, max: null }
      }

      return hostel
    }))

    res.json(hostelsWithPriceRange)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//function to create a new hostel
export const addHostel = async (req, res) => {
  const images = req.files ? req.files.map(file => file.filename) : [];
  const hostel = new Hostel({
    name: req.body.name,
    images,
    location: req.body.location,
    description: req.body.description,
    rules: req.body.rules,
    amenities: req.body.amenities,
    genderPolicy: req.body.genderPolicy,
    contactInfo: req.body.contactInfo,
    price: req.body.price
  })

  try {
    const newHostel = await hostel.save()
    res.status(201).json(newHostel)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

//function to update a hostel
export const updateHostel = async (req, res) => {
    try {
        if (req.body.name != null) {
            res.hostel.name = req.body.name
        }
        if (req.body.image != null) {
            res.hostel.image = req.body.image
        }
        if (req.body.location != null) {
            res.hostel.location = req.body.location
        }   
        if (req.body.description != null) {
            res.hostel.description = req.body.description
        }
        if (req.body.rules != null) {
            res.hostel.rules = req.body.rules
        }
        if (req.body.amenities != null) {
            res.hostel.amenities = req.body.amenities
        }
        if (req.body.genderPolicy != null) {
            res.hostel.genderPolicy = req.body.genderPolicy
        }
        if (req.body.contactInfo != null) {
            res.hostel.contactInfo = req.body.contactInfo
        }
        if (req.body.price != null) {
            res.hostel.price = req.body.price
        }
        
        const updatedHostel = await res.hostel.save()
        res.json(updatedHostel)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


//function to get hostel by id
export const getHostel = async (req, res, next) => {
    let hostel 
    try {
        hostel = await Hostel.findById(req.params.id)
        if (hostel === null) {
            return res.status(404).json({ message: 'Hostel not found' })
        }
    }catch (error) {
        return res.status(500).json({ message: error.message }) 
    }
    res.hostel = hostel
    next()
}
