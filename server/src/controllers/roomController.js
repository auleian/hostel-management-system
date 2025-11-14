import Room from '../models/roomModel.js'
import { logger } from '../middleware/logger.js'


//get all rooms with optional filters
export const getRooms = async (req, res) => {
    try {
        const filters = {}
        if (req.query.hostel) {
            filters.hostel = req.query.hostel
        }
        if (req.query.roomType) {
            filters.roomType = req.query.roomType
        }
        if (req.query.isAvailable) {
            filters.isAvailable = req.query.isAvailable === 'true'
        }
        if (req.query.minPrice) {
            filters.price = { ...filters.price, $gte: Number(req.query.minPrice) }
        }
        if (req.query.maxPrice) {
            filters.price = { ...filters.price, $lte: Number(req.query.maxPrice) }
        }
        const rooms = await Room.find(filters).populate('hostel').populate('createdBy', 'username email')
        res.json(rooms)
    } catch (error) {
        logger.error("Failed to get rooms:", error);
        res.status(500).json({ message: error.message })
    }
}


export const addRoom = async (req, res) => {
    const images = req.files ? req.files.map(file => file.filename) : [];
    const room = new Room({
        roomNumber: req.body.roomNumber,
        images,
        roomType: req.body.roomType,
        moreInfo: req.body.moreInfo,
        price: req.body.price,
        isAvailable: req.body.isAvailable,
        hostel: req.body.hostel,
        isSelfContained: req.body.isSelfContained,
        amenities: req.body.amenities,
        // TODO 
        // createdBy: req.user._id
    })
    try {
        const newRoom = await room.save()
        res.status(201).json(newRoom)
    } catch (error) {
        logger.error("Failed to add room:", error);
        res.status(400).json({ message: error.message })
    }
}


export const getRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id).populate('hostel').populate('createdBy', 'username email')
        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }
        res.json(room)
    } catch (error) {
        logger.error("Failed to get room:", error);
        res.status(500).json({ message: error.message })
    }
}

export const updateRoom = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id)
        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }
        // Update fields
        room.roomNumber = req.body.roomNumber || room.roomNumber
        room.roomType = req.body.roomType || room.roomType
        room.moreInfo = req.body.moreInfo || room.moreInfo
        room.price = req.body.price || room.price
        room.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : room.isAvailable
        room.hostel = req.body.hostel || room.hostel
        room.isSelfContained = req.body.isSelfContained !== undefined ? req.body.isSelfContained : room.isSelfContained
        room.amenities = req.body.amenities || room.amenities
        // Handle images
        const uploadedImages = req.files ? req.files.map(file => file.filename) : [];
        let existingImages = room.images || [];

        if (req.body.existingImages) {
            try {
                const parsedImages = JSON.parse(req.body.existingImages);
                existingImages = Array.isArray(parsedImages) ? parsedImages : [parsedImages];
            } catch {
                existingImages = Array.isArray(req.body.existingImages)
                    ? req.body.existingImages
                    : [req.body.existingImages];
            }
        }

        room.images = [...existingImages, ...uploadedImages];
        const updatedRoom = await room.save()
        res.json(updatedRoom)
    } catch (error) {
        logger.error("Failed to update room:", error);
        res.status(400).json({ message: error.message })
    }
}