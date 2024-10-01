import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    updateData,
    deleteData,
} from "../controllers/scrumboardController.js";

const route = Router();

route
    .route("/project/:projectId/scrumboard")
    .post(authCheck, createData)
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
