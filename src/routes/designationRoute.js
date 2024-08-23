import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import {
    createData, getAllData, getData,
    updateData, deleteData
} from "../controllers/designationController.js"

const route = Router()

route.route("/designation")
    .get(getAllData)
    .post(createData)


route.route("/designation/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData)

export default route



