import { Router } from "express";
import { upload } from "../middlewares/multerMiddleware.js";
import authCheck from "../middlewares/authMiddleware.js";
import {
    sendOtp,
    verifyOtp,
    registerUser,
    loginUser,
    googleLogin,
    googleRegister,
    logoutUser,
    refreshAccessToken,
} from "../controllers/authController.js";

const route = Router();

route.route("/auth/send-otp").post(sendOtp);
route.route("/auth/verify-otp").post(verifyOtp);
route.route("/auth/register").post(upload.single("avatar"), registerUser);
route.route("/auth/login").post(loginUser);
route.route("/auth/glogin").post(googleLogin);
route.route("/auth/gregister").post(googleRegister);
route.route("/auth/logout").post(authCheck, logoutUser);
route.route("/auth/refresh-token").post(refreshAccessToken);

export default route;
