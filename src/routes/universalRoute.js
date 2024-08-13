import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { countryList, employeeLevelList, employeeTypeList } from "../controllers/universalController.js"

const route = Router()

route.route("/countries").get(countryList)
route.route("/employee-level").get(employeeLevelList)
route.route("/employee-type").get(employeeTypeList)

export default route



