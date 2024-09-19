import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { getData, updateData } from "../controllers/policieController.js";

const route = Router();

route.route("/settings/policies").get(getData).patch(updateData);

export default route;
