import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    updateData,
    deleteData,
    sortSubtask,
} from "../controllers/subtaskController.js";

const route = Router();

route
    .route("/project/:projectId/task/:taskId/subtask")
    .post(authCheck, createData);

route
    .route("/project/:projectId/task/:taskId/subtask/sort")
    .put(authCheck, sortSubtask);

route
    .route("/project/:projectId/task/:taskId/subtask/:id")
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
