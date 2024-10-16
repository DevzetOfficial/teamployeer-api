import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    getAllData,
    getCountData,
    getData,
    createData,
    updateData,
    deleteData,
} from "../controllers/projectController.js";

const route = Router();

route
    .route("/project")
    .get(authCheck, getAllData)
    .post(authCheck, upload.single("projectImage"), createData);

route.route("/project/ongoing").get(authCheck, getAllData);
route.route("/project/onhold").get(authCheck, getAllData);
route.route("/project/completed").get(authCheck, getAllData);
route.route("/project/canceled").get(authCheck, getAllData);
route.route("/project/count").get(authCheck, getCountData);

route
    .route("/project/:id")
    .get(authCheck, getData)
    .put(authCheck, upload.single("projectImage"), updateData)
    .delete(authCheck, deleteData);

export default route;
