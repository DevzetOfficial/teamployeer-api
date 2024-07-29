import mongoose from "mongoose"


const connectBD = async () => {

    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log(`DB connect successfully: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("DB connection failed!", error);
        process.exit(1)
    }
}

export default connectBD