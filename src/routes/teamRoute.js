import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { getData, storeData, updateData } from "../controllers/teamController.js"

const route = Router()

route.route("/team").post(authCheck, storeData)
route.route("/team:id?").get(authCheck, getData).patch(authCheck, updateData)

export default route



