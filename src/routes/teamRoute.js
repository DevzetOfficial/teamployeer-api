import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { getAllData, getData, createData, updateData, deleteData } from "../controllers/teamController.js"

const route = Router()

/* route.route("/team")
    .get(authCheck, getAllData)
    .post(authCheck, createData)

route.route("/team/:id")
    .get(authCheck, getData)
    .patch(authCheck, updateData)
    .delete(authCheck, deleteData) */

route.route("/team")
    .get(getAllData)
    .post(createData)

route.route("/team/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData)

export default route



