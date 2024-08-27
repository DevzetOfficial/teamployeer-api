import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/multerMiddleware.js"
import {
    getActiveData, getInactiveData, getCountData,
    getData, createData, updateData, updateOffboarding, deleteData
} from "../controllers/employeeController.js"

const route = Router()


route.route("/employee")
    .get(getActiveData)
    .post(upload.single("avatar"), createData)

route.route("/employee/count").get(getCountData)
route.route("/employee/inactive").get(getInactiveData)

route.route("/employee/:id")
    .get(getData)
    .patch(upload.single("avatar"), updateData)
    .delete(deleteData)

    
route.route("/employee/offboarding/:id").patch(updateOffboarding)

export default route



