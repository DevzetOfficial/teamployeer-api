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

route.route("/project/:projectId/task").post(authCheck, createData);

/* route
    .route("/project/:projectId/task/:id/update-position")
    .post(authCheck, createTask); */

route
    .route("/project/:projectId/scrumboard/:scrumboardId/sort-task")
    .put(authCheck, sortTask);
route
    .route("/project/:projectId/scrumboard/:scrumboardId/task/:id/move")
    .put(authCheck, moveTask);

route
    .route("/project/:projectId/scrumboard/:scrumboardId/task/:id")
    .get(authCheck, getData)
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

/* route
    .route("/project/:projectId/task")
    .get(authCheck, getData)
    .delete(authCheck, deleteData); */

export default route;
