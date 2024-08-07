import dotenv from "dotenv"
dotenv.config({
    path: './.env'
})


import connectBD from "./db/config.js"
import { app } from "./app.js"


app.get('/', (req, res) => {
    res.send('Hello world')
})

const hostname = '127.0.0.1'
const port = process.env.PORT || 3000

connectBD()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running at port: ${port}`);
        })
    })
    .catch((error) => {
        console.log("DB connection failed! ", error);
    })
