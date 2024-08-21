import { Router } from "express"
import authCheck from "../middlewares/authMiddleware.js"
import { upload } from "../middlewares/multerMiddleware.js"
import {
    getActiveData, getInactiveData, getCountData,
    getData, createData, updateData, deleteData
} from "../controllers/clientController.js"

const route = Router()

/* route.route("/clients")
    .get(authCheck, getAllData)
    .post(authCheck, upload.single("avatar"), createData)

route.route("/clients/:id")
    .get(authCheck, getData)
    .patch(authCheck, upload.single("avatar"), updateData)
    .delete(authCheck, deleteData) */


route.route("/clients")
    .get(getActiveData)
    .post(upload.single("avatar"), createData)

route.route("/clients/inactive").get(getInactiveData)
route.route("/clients/count").get(getCountData)

route.route("/clients/:id")
    .get(getData)
    .patch(upload.single("avatar"), updateData)
    .delete(deleteData)

export default route



