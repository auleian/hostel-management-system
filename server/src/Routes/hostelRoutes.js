import { Router } from "express";
import {getHostels, getHostel, addHostel, updateHostel }  from '../controllers/hostelController.js';
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(process.cwd(), 'src/media/hostels');
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
        } catch (e) {
            console.error('Failed ensuring upload directory (hostels):', e);
        }
        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: { files: 5 },
});

const router = Router();

//getting all hostels
router.get('/', getHostels)

//getting a specific hostel with id
router.get('/:id', getHostel)

//creating a hostel
// Accept up to 5 images as 'images' field
router.post('/', upload.array('images', 5), addHostel)

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