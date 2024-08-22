import dotenv from "dotenv"
dotenv.config()
import { ApiError } from "./utilities/ApiError.js"
import connectDB from "./db/config.js"
import { app } from "./app.js"


app.get('/', (req, res) => {
    res.send('Welcome to Teamployeer')
})

app.all('*', (req, res, next) => {
    next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

const port = process.env.PORT || 3000

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        })
    })
    .catch((error) => {
        console.log("DB connection failed! ", error);
    })
