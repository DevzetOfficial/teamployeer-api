import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";

import {
    createData,
    getAllData,
    getCountData,
    getData,
    updateData,
    deleteData,
} from "../controllers/attendanceController.js";

const route = Router();

route
    .route("/attendance")
    .get(authCheck, getAllData)
    .post(authCheck, createData);

route.route("/attendance/present").get(authCheck, getAllData);
route.route("/attendance/absent").get(authCheck, getAllData);
route.route("/attendance/late").get(authCheck, getAllData);
route.route("/attendance/count").get(authCheck, getCountData);

route
    .route("/attendance/:id")
    .get(authCheck, getData)
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
