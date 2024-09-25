import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    getAllData,
    getCountData,
    getData,
    createData,
    updateData,
    deleteData,
    deleteAttachment,
} from "../controllers/timeoffController.js";

const route = Router();

route
    .route("/timeoff")
    .get(authCheck, getAllData)
    .post(authCheck, upload.array("attachments"), createData);

route.route("/timeoff/pending").get(authCheck, getAllData);
route.route("/timeoff/approved").get(authCheck, getAllData);
route.route("/timeoff/declined").get(authCheck, getAllData);
route.route("/timeoff/count").get(authCheck, getCountData);
route
    .route("/timeoff/:timeoffId/attachment/:id")
    .delete(authCheck, deleteAttachment);

route
    .route("/timeoff/:id")
    .get(authCheck, getData)
    .patch(authCheck, upload.array("attachments"), updateData)
    .delete(authCheck, deleteData);

export default route;
