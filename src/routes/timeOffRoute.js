import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/multerMiddleware.js"
import {
    getActiveData, getInactiveData, getCountData,
    getData, createData, updateData, deleteData
} from "../controllers/timeOffController.js"

const route = Router()


route.route("/timeoff")
    .get(getActiveData)
    .post(upload.array("attarchment"), createData)

route.route("/timeoff/inactive").get(getInactiveData)
route.route("/timeoff/count").get(getCountData)

route.route("/timeoff/:id")
    .get(getData)
    .patch(upload.single("avatar"), updateData)
    .delete(deleteData)

export default route



