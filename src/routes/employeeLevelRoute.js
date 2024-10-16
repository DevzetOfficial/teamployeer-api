import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/employeeLevelController.js";

const route = Router();

route
    .route("/settings/level")
    .get(authCheck, getAllData)
    .post(authCheck, createData);

route
    .route("/settings/level/:id")
    .get(authCheck, getData)
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
