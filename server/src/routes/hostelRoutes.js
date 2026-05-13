import { Router } from "express";
import {getHostels, getHostel, addHostel, updateHostel, deleteHostel, findHostel }  from '../controllers/hostelController.js';
import multer from "multer";
import path from "path";
import fs from "fs";
import { logger } from "../middleware/logger.js";
import { protect } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(process.cwd(), 'src/media/hostels');
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
        } catch (e) {
            logger.error('Failed ensuring upload directory (hostels):', e);
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
router.post('/', protect, requireAdmin, upload.array('images', 5), addHostel)

//updating a hostel (accept images too)
router.patch('/:id', protect, requireAdmin, upload.array('images', 5), findHostel, updateHostel)

//deleting a hostel
router.delete('/:id', protect, requireAdmin, findHostel, deleteHostel);

export default router;