import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    updateData,
    deleteData,
    sortAttachment,
} from "../controllers/taskAttachmentController.js";

const route = Router();

route
    .route("/project/:projectId/task/:taskId/attachment")
    .post(authCheck, createData);

route
    .route("/project/:projectId/task/:taskId/attachment/sort")
    .put(authCheck, sortAttachment);

route
    .route("/project/:projectId/task/:taskId/attachment/:id")
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
