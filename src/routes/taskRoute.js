import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    createTask,
    getData,
    updateTask,
    deleteData,
} from "../controllers/taskController.js";

const route = Router();

route
    .route("/project/:projectId/task")
    .post(authCheck, createTask)
    .get(authCheck, getData)
    .put(authCheck, updateTask)
    .delete(authCheck, deleteData);

export default route;
