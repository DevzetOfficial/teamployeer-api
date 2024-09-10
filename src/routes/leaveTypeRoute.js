import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/leaveTypeController.js";

const route = Router();

route.route("/leave-type").get(getAllData).post(createData);

route
    .route("/leave-type/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData);

export default route;
