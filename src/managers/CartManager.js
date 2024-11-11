import { readJsonFile, writeJsonFile } from "../utils/fileHandler.js";
import paths from "../utils/paths.js";
import { generateId } from "../utils/collectionHandler.js";
import ErrorManager from "./ErrorManager.js";

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
            throw new ErrorManager("No se encontró ningún carrito con el ID ingesado.", 404);
        }
        return cartFound;
    }

    async getAll() {
        try {
            this.#carts = await readJsonFile(paths.files, this.#jsonFileName);
            return this.#carts.map((cart) => ({
                id: cart.id,
                products: cart.products.map((cartProduct) => {
                    return {
                        product: cartProduct.product,
                        quantity: cartProduct.quantity,
                    };
                }),
            }));
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const cartFound = await this.$findOneById(id);
            return {
                id: cartFound.id,
                cartDetails: cartFound.products,
            };
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data) {
        try {
            const availableProducts = await readJsonFile(paths.files, "products.json");
            const products = data?.products?.map((item) => {
                const productExists = availableProducts.find(
                    (availableProduct) => availableProduct.id === Number(item.product),
                );
                if (!productExists) {
                    throw new ErrorManager(`Producto con ID ${item.product} no existe.`, 404);
                }
                return { product: productExists.id, quantity: 1 };
            });
            const cart = {
                id: generateId(await this.getAll()),
                products: products,
            };
            this.#carts.push(cart);
            await writeJsonFile(paths.files, this.#jsonFileName, this.#carts);
            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    updateCart = async (id, productId, quantity) => {
        try {
            const availableProducts = await readJsonFile(paths.files, "products.json");
            const productExists = availableProducts.find(
                (availableProduct) => availableProduct.id === Number(productId),
            );
            if (!productExists) {
                throw new ErrorManager(`Producto con ID ${productId} no existe.`, 404);
            }
            const cartFound = await this.$findOneById(id);
            const productIndex = cartFound.products.findIndex(
                (item) => item.product === Number(productId),
            );
            if(quantity <= 0){
                throw new ErrorManager("La cantidad del producto que estás intentando agregar es menor o igual a 0. Para agregar una cantidad, por favor, que sea mayor a 0.", 400);
            }
            if (productIndex >= 0) {
                cartFound.products[productIndex].quantity += quantity;
            } else {
                cartFound.products.push({ product: Number(productId), quantity: quantity });
            }
            const index = this.#carts.findIndex((item) => item.id === Number(id));
            this.#carts[index] = cartFound;
            await writeJsonFile(paths.files, this.#jsonFileName, this.#carts);
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    };
}