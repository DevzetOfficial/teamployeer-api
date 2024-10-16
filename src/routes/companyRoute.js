import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { getData, updateData } from "../controllers/companyController.js";

const route = Router();

route
    .route("/settings/company")
    .get(authCheck, getData)
    .put(authCheck, upload.single("logo"), updateData);

export default route;
