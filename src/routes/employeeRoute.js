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
    .get(authCheck, getActiveData)
    .post(authCheck, upload.single("avatar"), createData);

route.route("/employee/count").get(authCheck, getCountData);
route.route("/employee/inactive").get(authCheck, getInactiveData);
route.route("/employee/select-list").get(authCheck, getSelectList);
route.route("/employee/ratio").get(authCheck, getEmployeeRatio);

route
    .route("/employee/:id")
    .get(authCheck, getData)
    .patch(authCheck, upload.single("avatar"), updateData)
    .delete(authCheck, deleteData);

route.route("/employee/offboarding/:id").patch(authCheck, updateOffboarding);

route
    .route("/employee/:employeeId/document")
    .get(authCheck, getAllDocument)
    .post(authCheck, upload.single("attachment"), documentCreate);

route
    .route("/employee/:employeeId/timeoff")
    .get(authCheck, getAllTimeoff)
    .patch(authCheck, setEmployeeTimeOff);

route
    .route("/employee/:employeeId/document/:id")
    .patch(authCheck, updateDocument)
    .delete(authCheck, deleteDocument);

export default route;
