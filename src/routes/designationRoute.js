import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/designationController.js";

const route = Router();

route.route("/designation").get(getAllData).post(createData);

route
    .route("/designation/:id")
    .get(authCheck, getData)
    .patch(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
