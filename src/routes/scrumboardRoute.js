import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    updateData,
    updatePosition,
    deleteData,
} from "../controllers/scrumboardController.js";

const route = Router();

route.route("/project/:projectId/scrumboard").post(authCheck, createData);

route
    .route("/project/:projectId/scrumboard/update-position")
    .put(authCheck, updatePosition);

route
    .route("/project/:projectId/scrumboard/:id")
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
