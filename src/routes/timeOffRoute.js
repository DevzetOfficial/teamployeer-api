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
    .get(getAllData)
    .post(upload.array("attachments"), createData);

route.route("/timeoff/pending").get(getAllData);
route.route("/timeoff/approved").get(getAllData);
route.route("/timeoff/declined").get(getAllData);
route.route("/timeoff/count").get(getCountData);
route.route("/timeoff/:timeoffId/attachment/:id").delete(deleteAttachment);

route
    .route("/timeoff/:id")
    .get(getData)
    .patch(upload.array("attachments"), updateData)
    .delete(deleteData);

export default route;
