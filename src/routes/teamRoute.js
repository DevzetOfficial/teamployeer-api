import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { getAllData, getData, createData, updateData, deleteData } from "../controllers/teamController.js"

const route = Router()


route.route("/team")
    .get(getAllData)
    .post(createData)

route.route("/team/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData)

export default route



