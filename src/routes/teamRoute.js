import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { storeData } from "../controllers/teamController.js"

const route = Router()

route.route("/team").post(authCheck, storeData)

export default route



