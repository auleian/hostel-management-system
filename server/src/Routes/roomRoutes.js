import {Router} from "express"
import {addRoom, getRooms, getRoom} from "../controllers/roomController.js"
import multer from "multer"
import path from "path"
import fs from "fs"


const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(process.cwd(), 'src/media/rooms');
        try {
            fs.mkdirSync(uploadPath, { recursive: true });
        } catch (e) {
            console.error('Failed ensuring upload directory:', e);
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


const router = Router()
router.post("/", upload.array("images"), addRoom)
router.get("/", getRooms)
router.get("/:id", getRoom)


export default router