import {Router} from "express"
import {addRoom, getRooms, getRoom} from "../controllers/roomController.js"

const router = Router()
router.post("/create", addRoom)
router.get("/getAll", getRooms)
router.get("/:id", getRoom)


export default router