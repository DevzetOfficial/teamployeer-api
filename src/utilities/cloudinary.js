import { v2 as cloudinary } from "cloudinary";
import { generateCode, strSlud } from "../utilities/helper.js";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath, fileName) => {
    try {
        if (!filePath) return null;

        //upload the file on cloudinary
        if (fileName) {
            const d = new Date();
            const time = d.getTime();
            const fName =
                time +
                generateCode(6) +
                "-fn-" +
                fileName.split(".").slice(0, -1).join(".");

            const response = await cloudinary.uploader.upload(filePath, {
                public_id: strSlud(fName),
            });

            fs.unlinkSync(filePath);
            return response;
        }

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });

        // remove the locally saved temporary file
        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        console.log(error);

        // remove the locally saved temporary file
        fs.unlinkSync(filePath);
        return null;
    }
};

const destroyOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;

        const urlObj = new URL(filePath);
        const pathname = urlObj.pathname;
        const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
        const publicId = filename.split(".").slice(0, -1).join(".");

        //upload the file on cloudinary
        const response = await cloudinary.uploader.destroy(publicId);

        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export { uploadOnCloudinary, destroyOnCloudinary };
