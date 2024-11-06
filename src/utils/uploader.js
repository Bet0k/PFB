import multer from "multer";
import paths from "./paths.js";
import { generateNameForFile } from "./random.js";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        console.log("Ruta de destino:", paths.images);
        callback(null, paths.images);
    },
    filename: (req, file, callback) =>{
        const filename = generateNameForFile(file.originalname);
        console.log("Nombre del archivo:", filename);
        callback(null, filename);
    },
});

const uploader = multer({ storage });
export default uploader;