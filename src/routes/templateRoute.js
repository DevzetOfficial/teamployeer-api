import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    updateData,
    deleteData,
} from "../controllers/templateController.js";

const route = Router();

route.route("/template").get(getAllData).post(createData);

route.route("/template/:id").get(getData).patch(updateData).delete(deleteData);

export default route;
