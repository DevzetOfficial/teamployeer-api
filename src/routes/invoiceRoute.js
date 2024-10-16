import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    createData,
    getAllData,
    getData,
    getCountData,
    updateData,
    deleteData,
} from "../controllers/invoiceController.js";

const route = Router();

route
    .route("/invoice")
    .get(authCheck, getAllData)
    .post(authCheck, upload.single("signature"), createData);

route.route("/invoice/single").get(authCheck, getAllData);
route.route("/invoice/recurring").get(authCheck, getAllData);
route.route("/invoice/draft").get(authCheck, getAllData);
route.route("/invoice/count").get(authCheck, getCountData);

route
    .route("/invoice/:id")
    .get(authCheck, getData)
    .put(authCheck, upload.single("signature"), updateData)
    .delete(authCheck, deleteData);

export default route;
