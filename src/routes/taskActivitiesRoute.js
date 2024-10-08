import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    getData,
    deleteData,
} from "../controllers/taskActivitiesController.js";

const route = Router();

route
    .route("/project/:projectId/task/:taskId/activities")
    .get(authCheck, getData);

route
    .route("/project/:projectId/task/:taskId/activities/:id")
    .delete(authCheck, deleteData);

export default route;
