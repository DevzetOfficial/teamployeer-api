import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import authCheck from "../middlewares/auth.middleware.js"
import { registerUser, loginUser, logoutUser, refreshAccessToken } from "../controllers/auth.controller.js"

const route = Router()

route.route("/auth/register").post(upload.single('avatar'), registerUser)
route.route("/auth/login").post(loginUser)
route.route("/auth/logout").post(authCheck, logoutUser)
route.route("/auth/refresh-token").post(authCheck, refreshAccessToken)

export default route



