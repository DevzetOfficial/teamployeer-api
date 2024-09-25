import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/shiftController.js";

const route = Router();

route
    .route("/settings/shift")
    .get(authCheck, getAllData)
    .post(authCheck, createData);

route
    .route("/settings/shift/:id")
    .get(authCheck, getData)
    .patch(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
