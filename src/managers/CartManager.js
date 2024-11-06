import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandler.js";
//import { covertToBool } from "../utils/converter.js";
import ErrorManager from "./ErrorMangaer.js";

export default class CartManager{
    #jsonFileName;
    #carts;

    constructor() {
        this.#jsonFileName = "carts.json";
    }

    async $findOneById(id) {
        this.#carts = await this.getAll();
        const cartFound = this.#carts.find((item) => item.id === Number(id));
        if(!cartFound){
            throw new Error("No se encontró ningún carto con el ID ingesado.", 404);
        }
    }

    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFileName);
            return this.#carts;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const cartFound = await this.$findOneById(id);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data) {
        try {
            const { title, status, stock } = data;
            if(!title || status === undefined || status === null|| !stock){
                throw new ErrorManager("No se ingresaron los datos necesarios para crear el carto.", 400);
            }

            const cart = {
                id:  generateId(await this.getAll()),
                title,
                status,
                stock,
            };

            this.#carts.push(cart);
            await writeJsonFile(paths.files, this.#jsonFileName, this.#carts);

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    // async updateOneById(id, data) {
    //     try {
    //         const { title, status, stock } = data;
    //         const cartFound = this.getOneById(id);
    //         //const cartFound = await this.$findOneById(id);

    //         const cart = {
    //             id: cartFound.id,
    //             title: title || cartFound.title,
    //             status: status ? covertToBool(status) : cartFound.status,
    //             stock: stock ? Number(stock) : cartFound.stock,
    //         };

    //         const index = this.#carts.findIndex(() => item.id === Number(id));
    //         this.#carts[index] = cart;
    //         await writeJsonFile(paths.files, this.#jsonFileName, this.#carts);

    //         return cart;
    //     } catch (error) {
    //  throw new ErrorManager(error.message, error.code);
    //     }
    // }

    // async deleteOneById(id) {
    //     try {
    //         await this.getOneById(id);
    //         //const cartFound = await this.$findOneById(id);

    //         const index = this.#carts.findIndex(() => item.id === Number(id));
    //         this.#carts.splice[index, 1];
    //         await writeJsonFile(paths.files, this.#jsonFileName, this.#carts);

    //         return cart;
    //     } catch (error) {
    //    throw new ErrorManager(error.message, error.code);
    //     }
    // }
}