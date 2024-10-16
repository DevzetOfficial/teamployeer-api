import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { getData, updateData } from "../controllers/policyController.js";

const route = Router();

route
    .route("/settings/policies")
    .get(authCheck, getData)
    .put(authCheck, updateData);

export default route;
