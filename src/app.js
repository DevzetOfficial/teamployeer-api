import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import cookieParser from "cookie-parser"

const app = express()

// Set Access Origin
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

// Set security HTTP headers
app.use(helmet())

// Limit requests from same API
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use(limiter);

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(express.static("public"))
app.use(cookieParser())


// import routes
import countryRoute from "./routes/universalRoute.js"
import authRoute from "./routes/authRoute.js"
import teamRoute from "./routes/teamRoute.js"
import clientRoute from "./routes/clientRoute.js"
import employeeRoute from "./routes/employeeRoute.js"
import shiftRoute from "./routes/shiftRoute.js"
import companyRoute from "./routes/companyRoute.js"







// route declaration
app.use("/api/v1", countryRoute)
app.use("/api/v1", authRoute)
app.use("/api/v1", teamRoute)
app.use("/api/v1", clientRoute)
app.use("/api/v1", employeeRoute)
app.use("/api/v1", shiftRoute)
app.use("/api/v1", companyRoute)

export { app }
