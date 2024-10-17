import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    createData,
    getData,
    updateData,
    deleteData,
    sortAttachment,
} from "../controllers/taskAttachmentController.js";

const route = Router();

route
    .route("/project/:projectId/task/:taskId/attachment")
    .get(authCheck, getData)
    .post(authCheck, upload.array("attachments", 5), createData);

route
    .route("/project/:projectId/task/:taskId/attachment/sort")
    .put(authCheck, sortAttachment);

route
    .route("/project/:projectId/task/:taskId/attachment/:id")
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
