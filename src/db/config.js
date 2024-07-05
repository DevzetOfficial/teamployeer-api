import { PrismaClient } from "@prisma/client";

let prisma;

const connectDB = async () => {
    try {
        prisma = new PrismaClient({
            log: ["query", "info", "warn", "error"],
            // errorFormat: "colorless",
        });
        await prisma.$connect();
        console.log("DB connected successfully.");
    } catch (error) {
        console.error("DB connecting failed:", error);
    }
};

connectDB();

export default prisma;