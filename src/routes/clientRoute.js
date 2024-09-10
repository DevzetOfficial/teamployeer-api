import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    getActiveData,
    getInactiveData,
    getCountData,
    getData,
    createData,
    updateData,
    deleteData,
} from "../controllers/clientController.js";

const route = Router();

route
    .route("/client")
    .get(getActiveData)
    .post(upload.single("avatar"), createData);

route.route("/client/inactive").get(getInactiveData);
route.route("/client/count").get(getCountData);

route
    .route("/client/:id")
    .get(getData)
    .patch(upload.single("avatar"), updateData)
    .delete(deleteData);

export default route;
