import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    getAllData,
    getData,
    createData,
    updateData,
    deleteData,
    getCountData,
    getAllMembers,
} from "../controllers/teamController.js";

const route = Router();

route.route("/team").get(authCheck, getAllData).post(authCheck, createData);

route.route("/team/count").get(authCheck, getCountData);
route.route("/team/members").get(authCheck, getAllMembers);

route
    .route("/team/:id")
    .get(authCheck, getData)
    .patch(authCheck, updateData)
    .delete(authCheck, deleteData);

export default route;
