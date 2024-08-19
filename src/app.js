import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use((req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Foo', 'bar');
    next();
});

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))
app.use(express.static("public"))
app.use(cookieParser())



// import routes
import countryRoute from "./routes/universalRoute.js"
import authRoute from "./routes/authRoute.js"
import teamRoute from "./routes/teamRoute.js"







// route declaration
app.use("/api/v1", countryRoute)
app.use("/api/v1", authRoute)
app.use("/api/v1", teamRoute)


export { app }
