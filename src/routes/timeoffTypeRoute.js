import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/timeoffTypeController.js";

const route = Router();

route
    .route("/settings/timeoff")
    .get(authCheck, getAllData)
    .post(authCheck, createData);

route
    .route("/settings/timeoff/:id")
    .get(authCheck, getData)
    .patch(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
