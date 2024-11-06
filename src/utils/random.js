import moment from "moment";
import path from "path"; //No son las mismas que paths.js

export const generateNumber = (startNumber, endNumber) =>{
    if (startNumber > endNumber) {
        throw new Error("El número inicial no puede ser mayor que el final.");
    }

    return Math.floor(Math.random() * (endNumber - startNumber + 1) + startNumber);
};

export const generateNameForFile = (filename) =>{
    if (!filename || filename.indexOf(".") === -1) {
        throw new Error("El nombre del archivo es inválido.");
    }

    const randomNumber = generateNumber(1000, 9999);
    const datetime = moment().format("DDMMYYY_HHmmss");
    const extension = path.extname(filename);
    return `file_${randomNumber}_${datetime}${extension}`;
};