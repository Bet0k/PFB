import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandler.js";
import { covertToBool } from "../utils/converter.js";
import ErrorManager from "./ErrorManager.js";

export default class ProductManager {
    #jsonFileName;
    #products;

    constructor() {
        this.#jsonFileName = "products.json";
    }

    async $findOneById(id) {
        this.#products = await this.getAll();
        const productFound = this.#products.find((item) => item.id === Number(id));
        if (!productFound) {
            throw new ErrorManager("No se encontró ningún producto con el ID ingresado.", 404);
        }
        return productFound;
    }

    async getAll() {
        try {
            this.#products = await readJsonFile(paths.files, this.#jsonFileName);
            if (!Array.isArray(this.#products)) {
                throw new ErrorManager("Los datos no son un Array válido", 500);
            }
            return this.#products;
        } catch (error) {
            throw new ErrorManager(error.message, error.code || 500);
        }
    }
    async getOneById(id) {
        try {
            const productFound = await this.$findOneById(id);
            return productFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data, file) {
        try {
            const { title, description, code, price, status, stock, category } = data;

            if (!title || !description || !code || !price || status === undefined || status === null || !stock || !category) {
                throw new ErrorManager("No se ingresaron los datos necesarios para crear el producto.", 400);
            }
            else if (isNaN(price)){
                throw new ErrorManager("El precio debe ser numérico.", 400);
            }
            const product = {
                id: generateId(await this.getAll()),
                title,
                description,
                code,
                price: Number(price),
                status: covertToBool(status),
                stock,
                category,
                thumbnail: file?.filename || null,
            };
            this.#products.push(product);
            await writeJsonFile(paths.files, this.#jsonFileName, this.#products);
            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateOneById(id, data, file) {
        try {
            const { title, description, code, price, status, stock, category } = data;
            const productFound = await this.getOneById(id);
            const newThumbnail = file?.filename;
            if(price){
                if (isNaN(price)){
                    throw new ErrorManager("El precio debe ser numérico.", 400);
                }
            }

            const product = {
                id: productFound.id,
                title: title || productFound.title,
                description: description || productFound.description,
                code: code || productFound.code,
                price: price || productFound.price,
                status: status !== undefined ? covertToBool(status) : productFound.status,
                stock: stock !== undefined ? Number(stock) : productFound.stock,
                category: category || productFound.category,
                thumbnail: newThumbnail || productFound.thumbnail,
            };

            const index = this.#products.findIndex((item) => item.id === Number(id));
            if (index === -1) {
                throw new ErrorManager("Producto no encontrado en la lista", 404);
            }
            this.#products[index] = product;
            await writeJsonFile(paths.files, this.#jsonFileName, this.#products);

            return product;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById(id) {
        try {
            if (!Array.isArray(this.#products)) {
                this.#products = await this.getAll();
            }

            const index = this.#products.findIndex((item) => item.id === Number(id));

            if (index === -1) {
                throw new ErrorManager("Producto no encontrado en la lista", 404);
            }
            const deletedProduct = this.#products.splice(index, 1)[0];
            await writeJsonFile(paths.files, this.#jsonFileName, this.#products);
            return deletedProduct;
        } catch (error) {
            throw new ErrorManager(error.message, error.code || 500);
        }
    }
}