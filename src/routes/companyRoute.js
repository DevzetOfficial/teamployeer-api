import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    getData,
    updateData,
    deleteImage,
} from "../controllers/companyController.js";

const route = Router();

route
    .route("/company")
    .get(getData)
    .patch(upload.single("logo"), updateData)
    .delete(deleteImage);

export default route;
