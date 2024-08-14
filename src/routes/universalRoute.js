import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import {
    countryList, employeeLevelList, employeeTypeList,
    companyTypeList, companySizeList
} from "../controllers/universalController.js"

const route = Router()

route.route("/countries").get(countryList)
route.route("/employee-level").get(employeeLevelList)
route.route("/employee-type").get(employeeTypeList)
route.route("/company-type").get(companyTypeList)
route.route("/company-size").get(companySizeList)

export default route



