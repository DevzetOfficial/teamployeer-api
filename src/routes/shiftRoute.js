import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import {
    createData, getAllData, getData,
    updateData, updateStatus, deleteData
} from "../controllers/shiftController.js"

const route = Router()

route.route("/shift")
    .get(getAllData)
    .post(createData)


route.route("/shift/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData)

route.route("/shift/status/:id").patch(updateStatus)

export default route



