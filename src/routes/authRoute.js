import { Router } from "express";
import authCheck from "../middlewares/authMiddleware.js";
import {
    sendOtp,
    verifyOtp,
    register,
    login,
    googleLogin,
    googleRegister,
    logoutUser,
    refreshAccessToken,
} from "../controllers/authController.js";

const route = Router();

route.route("/auth/send-otp").post(sendOtp);
route.route("/auth/verify-otp").post(verifyOtp);
route.route("/auth/register").post(register);
route.route("/auth/login").post(login);
route.route("/auth/gregister").post(googleRegister);
route.route("/auth/glogin").post(googleLogin);
route.route("/auth/logout").post(authCheck, logoutUser);
route.route("/auth/refresh-token").post(refreshAccessToken);

export default route;
