import { PrismaClient } from "@prisma/client";

let connectDB;

const connectDBFn = async () => {
    try {
        connectDB = new PrismaClient({
            log: ["query", "info", "warn", "error"],
            // errorFormat: "colorless",
        });
        await connectDB.$connect();
        console.log("DB connected successfully.");
    } catch (error) {
        console.error("DB connecting failed:", error);
        process.exit(1);
    }
};

connectDBFn();

export default connectDB;