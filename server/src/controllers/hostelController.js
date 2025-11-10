import Hostel from '../models/hostelModel.js'
import mongoose from 'mongoose'
import Room from '../models/roomModel.js'

const normalizeAmenityValue = (val) => {
  if (!val && val !== 0) return null;
  const v = String(val).toLowerCase().trim();
  if (v.includes('shuttle')) return 'shuttle';
  if (v === 'wifi') return 'wifi';
  if (v === 'security') return 'security';
  if (v === 'parking') return 'parking';
  if (v === 'library') return 'library';
  if (v === 'laundry') return 'laundry';
  // if already a short id, just return it
  return v;
}

const normalizeAmenities = (raw) => {
  if (raw == null) return [];
  let arr = [];
  if (Array.isArray(raw)) {
    arr = raw;
  } else if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      arr = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      arr = [raw];
    }
  } else {
    arr = [raw];
  }

  return arr
    .map(a => normalizeAmenityValue(a))
    .filter(Boolean);
}


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
    amenities: normalizeAmenities(req.body.amenities),
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
    // Merge images: keep existingImages from body + add any newly uploaded files
    const uploadedImages = req.files?.length ? req.files.map(f => f.filename) : [];

    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch {
        existingImages = Array.isArray(req.body.existingImages)
          ? req.body.existingImages
          : [req.body.existingImages];
      }
    }

    if (req.body.name != null) {
      res.hostel.name = req.body.name;
    }
    if (req.body.location != null) {
      res.hostel.location = req.body.location;
    }
    if (req.body.availableRooms != null) {
      const rooms = Number(req.body.availableRooms);
      res.hostel.availableRooms = Number.isNaN(rooms) ? 0 : rooms;
    }
    if (req.body.description != null) {
      res.hostel.description = req.body.description;
    }
    if (req.body.rules != null) {
      res.hostel.rules = req.body.rules;
    }
    if (req.body.amenities != null) {
      const raw = typeof req.body.amenities === 'string'
        ? (() => { try { return JSON.parse(req.body.amenities); } catch { return req.body.amenities; } })()
        : req.body.amenities;
      res.hostel.amenities = normalizeAmenities(raw);
    }
    if (req.body.genderPolicy != null) {
      res.hostel.genderPolicy = req.body.genderPolicy;
    }
    if (req.body.contactInfo != null) {
      res.hostel.contactInfo = req.body.contactInfo;
    }
    // priceRange may come as priceRange[min] and priceRange[max] or JSON string
    if (req.body['priceRange[min]'] != null || req.body['priceRange[max]'] != null) {
      const min = req.body['priceRange[min]'];
      const max = req.body['priceRange[max]'];
      if (min != null) res.hostel.priceRange.min = Number(min);
      if (max != null) res.hostel.priceRange.max = Number(max);
    } else if (req.body.priceRange != null) {
      try {
        const parsed = typeof req.body.priceRange === 'string'
          ? JSON.parse(req.body.priceRange)
          : req.body.priceRange;
        if (parsed.min != null) res.hostel.priceRange.min = Number(parsed.min);
        if (parsed.max != null) res.hostel.priceRange.max = Number(parsed.max);
      } catch {}
    }

    // Set final images
    const mergedImages = [...existingImages, ...uploadedImages];
    if (mergedImages.length) {
      res.hostel.images = mergedImages;
    }

    const updatedHostel = await res.hostel.save();
    res.json(updatedHostel);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
export const getHostel = async (req, res) => {
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
}

//middleware to find hostel by id (for update/delete operations)
export const findHostel = async (req, res, next) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid hostel ID' })
    }
    const hostel = await Hostel.findById(id)
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' })
    }
    res.hostel = hostel
    next()
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
