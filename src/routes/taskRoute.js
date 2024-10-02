import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    createData,
    getData,
    updateTask,
    deleteData,
} from "../controllers/taskController.js";

const route = Router();

route.route("/project/:projectId/task").post(authCheck, createData);

/* route
    .route("/project/:projectId/task/:id/update-position")
    .post(authCheck, createTask); */

route
    .route("/project/:projectId/task/:id")
    .get(authCheck, getData)
    .put(authCheck, updateTask)
    .delete(authCheck, deleteData);

route
    .route("/project/:projectId/task")
    .get(authCheck, getData)
    .put(authCheck, updateTask)
    .delete(authCheck, deleteData);

export default route;
