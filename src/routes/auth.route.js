import { Router } from "express"
import { upload } from "../middlewares/multer.middleware.js"
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js"

const route = Router()

route.route("/auth/register").post(upload.single('avatar'), registerUser)
route.route("/auth/login").post(loginUser)
route.route("/auth/logout").post(logoutUser)

export default route



