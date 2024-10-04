import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    createData,
    getData,
    updateData,
    deleteData,
    sortTask,
    moveTask,
} from "../controllers/taskController.js";

const route = Router();

route
    .route("/project/:projectId/scrumboard/:scrumboardId/task")
    .post(authCheck, createData);

route
    .route("/project/:projectId/scrumboard/:scrumboardId/task/sort")
    .put(authCheck, sortTask);

route
    .route(
        "/project/:projectId/scrumboard/:scrumboardId/task/:id/move/:toScrumboardId"
    )
    .get(authCheck, moveTask);

route
    .route("/project/:projectId/scrumboard/:scrumboardId/task/:id")
    .get(authCheck, getData)
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
