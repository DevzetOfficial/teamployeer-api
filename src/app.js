import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import favicon from "serve-favicon";
import path from "path";

const app = express();

//  Set favicon
app.use(favicon(path.resolve("./public/favicon.ico")));

app.set("trust proxy", 1);

// Set Access Origin
const allowedOrigins = ["http://localhost:3000", "https://app.teamployeer.com"];
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Set security HTTP headers
app.use(helmet());

// Limit requests from same API
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 200,
    message:
        "Too many requests from this IP, please try after some time again.",
});
app.use(limiter);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// import routes
import countryRoute from "./routes/universalRoute.js";
import authRoute from "./routes/authRoute.js";
import projectRoute from "./routes/projectRoute.js";
import scrumboardRoute from "./routes/scrumboardRoute.js";
import taskRoute from "./routes/taskRoute.js";
import subtaskRoute from "./routes/subtaskRoute.js";
import taskAttachmentRoute from "./routes/taskAttachmentRoute.js";
import taskCommentRoute from "./routes/taskCommentRoute.js";
import taskActivitiesRoute from "./routes/taskActivitiesRoute.js";
import clientRoute from "./routes/clientRoute.js";
import invoiceRoute from "./routes/invoiceRoute.js";
import teamRoute from "./routes/teamRoute.js";
import employeeRoute from "./routes/employeeRoute.js";
import attendanceRoute from "./routes/attendanceRoute.js";
import shiftRoute from "./routes/shiftRoute.js";
import companyRoute from "./routes/companyRoute.js";
import systemRoute from "./routes/systemRoute.js";
import designationRoute from "./routes/designationRoute.js";
import employeeLevelRoute from "./routes/employeeLevelRoute.js";
import timeoffRoute from "./routes/timeoffRoute.js";
import timeoffTypeRoute from "./routes/timeoffTypeRoute.js";
import templateRoute from "./routes/templateRoute.js";
import emailSettingsRoute from "./routes/emailSettingsRoute.js";
import policyRoute from "./routes/policyRoute.js";

// route declaration
app.use("/api/v1", countryRoute);
app.use("/api/v1", authRoute);
app.use("/api/v1", projectRoute);
app.use("/api/v1", scrumboardRoute);
app.use("/api/v1", taskRoute);
app.use("/api/v1", subtaskRoute);
app.use("/api/v1", taskAttachmentRoute);
app.use("/api/v1", taskCommentRoute);
app.use("/api/v1", taskActivitiesRoute);
app.use("/api/v1", clientRoute);
app.use("/api/v1", invoiceRoute);
app.use("/api/v1", teamRoute);
app.use("/api/v1", employeeRoute);
app.use("/api/v1", attendanceRoute);
app.use("/api/v1", shiftRoute);
app.use("/api/v1", companyRoute);
app.use("/api/v1", systemRoute);
app.use("/api/v1", designationRoute);
app.use("/api/v1", employeeLevelRoute);
app.use("/api/v1", timeoffRoute);
app.use("/api/v1", timeoffTypeRoute);
app.use("/api/v1", templateRoute);
app.use("/api/v1", emailSettingsRoute);
app.use("/api/v1", policyRoute);

export { app };
