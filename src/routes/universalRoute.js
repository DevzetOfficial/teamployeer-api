import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    countryList,
    countryInfo,
    companyTypeList,
    companySizeList,
    employeeLevelList,
    employeeTypeList,
    provationPeriodList,
    offboardingTypeList,
    offboardingReasonList,
    projectStatusList,
    leaveStatusList,
    permissionList,
} from "../controllers/universalController.js";

const route = Router();

// public routs
route.route("/countries").get(countryList);
route.route("/country-info/:id").get(countryInfo);
route.route("/company-types").get(companyTypeList);
route.route("/company-sizes").get(companySizeList);

// private routs
route.route("/permissions").get(authCheck, permissionList);
route.route("/employee-levels").get(authCheck, employeeLevelList);
route.route("/employee-types").get(authCheck, employeeTypeList);
route.route("/provation-period").get(authCheck, provationPeriodList);
route.route("/offboarding-types").get(authCheck, offboardingTypeList);
route.route("/offboarding-reasons").get(authCheck, offboardingReasonList);
route.route("/project-status").get(authCheck, projectStatusList);
route.route("/leave-status").get(authCheck, leaveStatusList);

export default route;
