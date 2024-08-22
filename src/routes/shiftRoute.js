import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import {
    createData, getAllData, getData,
    createData, updateData, deleteData
} from "../controllers/shiftController.js"

const route = Router()

route.route("/shift")
    .get(getAllData)
    .post(createData)


route.route("/shift/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData)

export default route



