import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";
import {
    getActiveData,
    getInactiveData,
    getCountData,
    getData,
    createData,
    updateData,
    updateOffboarding,
    deleteData,
    getSelectList,
    getEmployeeRatio,
} from "../controllers/employeeController.js";

import {
    documentCreate,
    getAllDocument,
    updateDocument,
    deleteDocument,
} from "../controllers/employeeDocumentController.js";

import {
    getAllTimeoff,
    setEmployeeTimeOff,
} from "../controllers/employeeTimeoffController.js";

const route = Router();

route
    .route("/employee")
    .get(getActiveData)
    .post(upload.single("avatar"), createData);

route.route("/employee/count").get(getCountData);
route.route("/employee/inactive").get(getInactiveData);
route.route("/employee/select-list").get(getSelectList);
route.route("/employee/ratio").get(getEmployeeRatio);

route
    .route("/employee/:id")
    .get(getData)
    .patch(upload.single("avatar"), updateData)
    .delete(deleteData);

route.route("/employee/offboarding/:id").patch(updateOffboarding);

route
    .route("/employee/:employeeId/document")
    .get(getAllDocument)
    .post(upload.single("attachment"), documentCreate);

route
    .route("/employee/:employeeId/timeoff")
    .get(getAllTimeoff)
    .patch(setEmployeeTimeOff);

route
    .route("/employee/:employeeId/document/:id")
    .patch(updateDocument)
    .delete(deleteDocument);

export default route;
