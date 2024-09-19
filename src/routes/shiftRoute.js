import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/shiftController.js";

const route = Router();

route.route("/settings/shift").get(getAllData).post(createData);

route
    .route("/settings/shift/:id")
    .get(getData)
    .patch(updateData)
    .delete(deleteData);

export default route;
