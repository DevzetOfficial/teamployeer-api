import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { getData, updateData } from "../controllers/emailSettingsController.js";

const route = Router();

route
    .route("/settings/email")
    .get(authCheck, getData)
    .patch(authCheck, updateData);

export default route;
