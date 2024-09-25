import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import authCheck from "../middlewares/authMiddleware.js";
import {
    sendOtp,
    verifyOtp,
    registerUser,
    loginUser,
    googleLoginUser,
    logoutUser,
    refreshAccessToken,
} from "../controllers/authController.js";

const route = Router();

route.route("/auth/send-otp").post(sendOtp);
route.route("/auth/verify-otp").post(verifyOtp);
route.route("/auth/register").post(upload.single("avatar"), registerUser);
route.route("/auth/login").post(loginUser);
route.route("/auth/glogin").post(googleLoginUser);
route.route("/auth/logout").post(authCheck, logoutUser);
route.route("/auth/refresh-token").post(refreshAccessToken);

export default route;
