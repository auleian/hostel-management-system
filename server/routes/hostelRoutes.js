const express = require('express')
const router = express.Router()
const Hostel = require('../models/hostel')
const { getHostel, addHostel, updateHostel } = require('../controllers/hostelController')

//getting all hostels
router.get('/', async (req, res) => {
  try {
    const hostels = await Hostel.find()
    res.json(hostels)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//getting a specific hostel with id
router.get('/:id', getHostel)

//creating a hostel
router.post('/',addHostel)

//updating a hostel
router.patch('/:id', getHostel, updateHostel)

//deleting a hostel
router.delete('/:id', getHostel, async (req, res) => {
    try {
        await res.hostel.remove()
        res.status(204).json()
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})



module.exports = router