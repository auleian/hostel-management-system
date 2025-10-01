import {Router} from "express"
import {createRoom, getAllRooms, getRoom} from "../controllers/roomController.js"

const router = Router()
router.post("/create", createRoom)
router.get("/getAll", getAllRooms)
router.get("/:id", getRoom)


export default router