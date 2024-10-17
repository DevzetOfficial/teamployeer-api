import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    createData,
    getData,
    getAllData,
    getCountData,
    updateData,
    deleteData,
} from "../controllers/clientController.js";

const route = Router();

route
    .route("/client")
    .get(authCheck, getAllData)
    .post(authCheck, upload.single("avatar"), createData);

route.route("/client/inactive").get(authCheck, getAllData);
route.route("/client/count").get(authCheck, getCountData);

route
    .route("/client/:id")
    .get(authCheck, getData)
    .put(authCheck, upload.single("avatar"), updateData)
    .delete(authCheck, deleteData);

export default route;
