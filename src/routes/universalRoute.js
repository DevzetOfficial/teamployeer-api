import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import {
    countryList, employeeLevelList, employeeTypeList,
    companyTypeList, companySizeList
} from "../controllers/universalController.js"

const route = Router()

route.route("/countries").get(countryList)
route.route("/employee-levels").get(employeeLevelList)
route.route("/employee-types").get(employeeTypeList)
route.route("/company-types").get(companyTypeList)
route.route("/company-sizes").get(companySizeList)

export default route



