import { Router } from "express";
import {getHostels, getHostel, addHostel, updateHostel }  from '../controllers/hostelController.js';

const router = Router();

//getting all hostels
router.get('/', getHostels)

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

export default router;