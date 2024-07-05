import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
    // allowedHeaders: ["Content-Type", "Authorization"],
    // exposedHeaders: ["Content-Type", "Authorization"],
    // methods: ["GET", "POST", "PUT", "DELETE"],
}))

app.use(express.json({
    limit: "5mb",
    extended: true,
}))

app.use(express.urlencoded({
    limit: "5mb",
    extended: true,
}))

app.use(express.static("public"))

app.use(cookieParser())



export { app }
