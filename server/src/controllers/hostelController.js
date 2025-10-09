import Hostel from '../models/hostelModel.js'
import mongoose from 'mongoose'

//get all hostels
export const getHostels = async (req, res) => {
  try {
    const { name, minPrice, maxPrice } = req.query
    let filter = {}

    if (name) {
      filter.name = { $regex: name, $options: 'i' }
    }
    if (minPrice) {
      filter.price = { ...filter.price, $gte: Number(minPrice) }
    }
    if (maxPrice) {
      filter.price = { ...filter.price, $lte: Number(maxPrice) }
    }

    const hostels = await Hostel.find(filter)
    res.json(hostels)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//function to create a new hostel
export const addHostel = async (req, res) => {
  const hostel = new Hostel({
    name: req.body.name,
    image: req.body.image,
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
         if (req.body.priceRange != null) {
            res.hostel.priceRange = req.body.priceRange
        }
        
        const updatedHostel = await res.hostel.save()
        res.json(updatedHostel)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}


//function to get hostel by id
export const getHostel = async (req, res, next) => {
     try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hostel ID' })
    }
    const hostel = await Hostel.findById(id)
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' })
    }
    res.json(hostel)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  next()
}
