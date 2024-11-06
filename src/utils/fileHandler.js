//Permite leer y guardar en JSon
import fs from "fs";
import path from "path";

const validateFilePathAndName = (filepath, filename) =>{
    if (!filepath) throw new Error(`La ruta del archivo ${filename} no fue proporcionada.`);
    if (!filepath) throw new Error("El nombre del archivo no fue proporcionado.");
};

export const readJsonFile = async (filepath, filename) => {
    validateFilePathAndName(filepath, filename);
    try {
        const content = await fs.promises.readFile(path.join(filepath, filename), "utf8");
        return JSON.parse(content || "[]");
    } catch (error) {
        throw new Error(`No se pudo leer el archivo ${filename}.`);
    }
};

export const writeJsonFile = async (filepath, filename, content) => {
    validateFilePathAndName(filepath, filename);
    if(!content) throw new Error(`El contenido para escribir el arhivo ${filename} no fue proporcionado.`);
    try {
        await fs.promises.writeFile(path.join(filepath, filename), JSON.stringify(content, null, "\t"), "utf8");
    } catch (error) {
        throw new Error(`No se pudo escribir en el archivo ${filename}.`);
    }
};