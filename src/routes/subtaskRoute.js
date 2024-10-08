import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getData,
    updateData,
    deleteData,
    sortSubtask,
    completeSubtask,
} from "../controllers/subtaskController.js";

const route = Router();

route
    .route("/project/:projectId/task/:taskId/subtask")
    .get(authCheck, getData)
    .post(authCheck, createData);

route
    .route("/project/:projectId/task/:taskId/subtask/sort")
    .put(authCheck, sortSubtask);

route
    .route("/project/:projectId/task/:taskId/subtask/completed/:subtaskId?")
    .put(authCheck, completeSubtask);

route
    .route("/project/:projectId/task/:taskId/subtask/:id")
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
