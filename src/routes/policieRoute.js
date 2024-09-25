import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { getData, updateData } from "../controllers/policieController.js";

const route = Router();

route
    .route("/settings/policies")
    .get(authCheck, getData)
    .patch(authCheck, updateData);

export default route;
