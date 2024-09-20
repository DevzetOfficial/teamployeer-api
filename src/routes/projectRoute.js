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
    .get(getAllData)
    .post(upload.single("projectImage"), createData);

route.route("/project/ongoing").get(getAllData);
route.route("/project/onhold").get(getAllData);
route.route("/project/completed").get(getAllData);
route.route("/project/canceled").get(getAllData);
route.route("/project/count").get(getCountData);

route
    .route("/project/:id")
    .get(getData)
    .patch(upload.single("projectImage"), updateData)
    .delete(deleteData);

export default route;
