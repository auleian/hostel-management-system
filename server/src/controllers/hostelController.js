import Hostel from '../models/hostelModel.js'
import mongoose from 'mongoose'
import Room from '../models/roomModel.js'


//get all hostels
export const getHostels = async (req, res) => {
  try {
    const { name, minPrice, maxPrice } = req.query
    let filter = {}

    if (name) {
      filter.name = { $regex: name, $options: 'i' }
    }
    if (minPrice || maxPrice) {
      filter.$and = [];
      
      if (minPrice) {
        filter.$and.push({ "priceRange.max": { $gte: Number(minPrice) } });
      }
      
      if (maxPrice) {
        filter.$and.push({ "priceRange.min": { $lte: Number(maxPrice) } });
      }
    }
    /*console.log("Filter query:", JSON.stringify(filter, null, 2));*/

    const hostels = await Hostel.find(filter)
const hostelsWithPriceRange = hostels.map(h => {
  const hostel = h.toObject();
  return {
    ...hostel,
    priceRange: hostel.priceRange ?? { min: null, max: null },
  };
});

    res.json(hostelsWithPriceRange)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//function to create a new hostel
export const addHostel = async (req, res) => {
  const uploadedImages = req.files?.length
    ? req.files.map(file => file.filename)
    : [];

  let bodyImages = [];
  if (!uploadedImages.length && req.body.images != null) {
    bodyImages = Array.isArray(req.body.images)
      ? req.body.images
      : [req.body.images];
  }
  const hostel = new Hostel({
    name: req.body.name,
    images:  [...uploadedImages, ...bodyImages],
    location: req.body.location,
    availableRooms: req.body.availableRooms,
    description: req.body.description,
    rules: req.body.rules,
    amenities: req.body.amenities,
    genderPolicy: req.body.genderPolicy,
    contactInfo: req.body.contactInfo,
    priceRange: {
    min: req.body.priceRange?.min || req.body.price,
    max: req.body.priceRange?.max || req.body.price
  }
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
        if (req.body.images != null) {
            const images = Array.isArray(req.body.images) ? req.body.images : [req.body.images]
            res.hostel.images = images
        }
        if (req.body.location != null) {
            res.hostel.location = req.body.location
        }
        if (req.body.availableRooms != null) {
            res.hostel.availableRooms = req.body.availableRooms
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
            if (req.body.priceRange.min != null) {
              res.hostel.priceRange.min = req.body.priceRange.min;
            }
            if (req.body.priceRange.max != null) {
              res.hostel.priceRange.max = req.body.priceRange.max;
            }
          }
        const updatedHostel = await res.hostel.save()
        res.json(updatedHostel)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteHostel = async (req, res) => {
    try {
        await Hostel.findByIdAndDelete(req.params.id) // NEW: real delete
        res.status(204).send()
    } catch (error) {
        console.error('Delete hostel failed:', error)
        res.status(500).json({ message: 'Server error deleting hostel' })
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
    res.hostel = hostel
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }

}
