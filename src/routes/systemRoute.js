import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { getData, updateData } from "../controllers/systemController.js";

const route = Router();

route
    .route("/settings/system")
    .get(authCheck, getData)
    .patch(authCheck, updateData);

export default route;
