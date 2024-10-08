import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getData,
    updateData,
    deleteData,
    createReply,
    updateReply,
    deleteReply,
} from "../controllers/taskCommentController.js";

const route = Router();

route
    .route("/project/:projectId/task/:taskId/comment")
    .get(authCheck, getData)
    .post(authCheck, createData);

route
    .route("/project/:projectId/task/:taskId/comment/:id")
    .put(authCheck, updateData)
    .delete(authCheck, deleteData);

route
    .route("/project/:projectId/task/:taskId/comment/:commentId/reply")
    .post(authCheck, createReply);

route
    .route("/project/:projectId/task/:taskId/comment/:commentId/reply/:id")
    .put(authCheck, updateReply)
    .delete(authCheck, deleteReply);

export default route;
