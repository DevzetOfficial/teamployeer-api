import dotenv from "dotenv"
import connectDB from "./db/config.js"
import {app} from "./app.js"

import bcrypt from "bcrypt"

dotenv.config({
    path: "./env"
});

const port = process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello World! Test')
  })

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})


