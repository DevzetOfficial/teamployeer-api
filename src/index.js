import dotenv from "dotenv"
import connectBD from "./db/config.js"
import { app } from "./app.js"
dotenv.config({
    path: './.env'
})

app.get('/', (req, res) => {
    res.send('Hello world')
})

const PORT = process.env.PORT || 3000

connectBD()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running at port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.log("DB connection failed! ", error);
    })
