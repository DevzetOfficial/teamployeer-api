import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/timeoffTypeController.js";

const route = Router();

route.route("/settings/timeoff").get(getAllData).post(createData);

route
    .route("/settings/timeoff/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData);

export default route;
