import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/templateController.js";

const route = Router();

route
    .route("/settings/template")
    .get(authCheck, getAllData)
    .post(authCheck, createData);

route
    .route("/settings/template/:id")
    .get(authCheck, getData)
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
