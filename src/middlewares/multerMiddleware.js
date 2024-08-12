import multer from "multer"

/* const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, "./public/temp")
    },
    filename: function (req, file, cd) {
        cd(null, file.originalname)
    }
}) */

const storage = multer.memoryStorage();


export const upload = multer({ storage })