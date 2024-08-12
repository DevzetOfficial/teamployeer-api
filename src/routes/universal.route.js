import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { countryList } from "../controllers/universal.controller.js"

const route = Router()

route.route("/countries").get(authCheck, countryList)

export default route



