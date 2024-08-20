import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { getAllData, getData, createData, updateData, deleteData } from "../controllers/teamController.js"

const route = Router()

route.route("/")
    .get(authCheck, getAllData)
    .post(authCheck, createData)

route.route("/:id")
    .get(authCheck, getData)
    .patch(authCheck, updateData)
    .delete(authCheck, deleteData)

export default route



