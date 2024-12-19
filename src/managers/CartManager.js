import Product from "../models/products.model.js";
import Cart from "../models/carts.model.js";
import ErrorManager from "./ErrorManager.js";

export default class CartManager {
    async getAll() {
        try {
            const carts = await Cart.find().populate('products.productId', 'title description price code status stock category ');
            return carts.map((cart) => ({
                id: cart._id,
                products: cart.products.map((cartProduct) => ({
                    product: cartProduct.productId,
                    quantity: cartProduct.quantity,
                })),
            }));
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async getOneById(id) {
        try {
            const cartFound = await Cart.findById(id).populate('products.productId', 'title description price code status stock category');
            if (!cartFound) {
                throw new ErrorManager("Carrito no encontrado.", 404);
            }
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async insertOne(data) {
        try {
            const availableProducts = await Product.find();
            const products = data?.products?.map((item) => {
                const productExists = availableProducts.find(
                    (availableProduct) => availableProduct._id.toString() === item.product.toString(),
                );
                if (!productExists) {
                    throw new ErrorManager(`Producto con ID ${item.product} no existe.`, 404);
                }
                return {
                    productId: productExists._id,
                    quantity: item.quantity || 1
                };
            });

            const newCart = new Cart({
                products: products,
            });
            await newCart.save();
            return newCart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async updateCart(id, productId, quantity) {
        try {
            const availableProduct = await Product.findById(productId);
            if (!availableProduct) {
                throw new ErrorManager(`Producto con ID ${productId} no encontrado.`, 404);
            }

            const cartFound = await Cart.findById(id);
            if (!cartFound) {
                throw new ErrorManager("Carrito no encontrado.", 404);
            }

            const productIndex = cartFound.products.findIndex(
                (item) => item.productId.toString() === productId.toString(),
            );

            if (quantity <= 0) {
                throw new ErrorManager("La cantidad debe ser mayor a 0.", 400);
            }

            if (productIndex >= 0) {
                cartFound.products[productIndex].quantity += quantity;
            } else {
                cartFound.products.push({
                    productId: productId,
                    quantity: quantity
                });
            }

            await cartFound.save();
            return cartFound;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

    async deleteOneById(id) {
        try {
            const cartFound = await this.getOneById(id);

            await cartFound.deleteOne();

        } catch (error) {
            throw ErrorManager.handleError(error);
        }
    }

    async deleteAllProductsFromCart(id) {
        try {
            const cart = await Cart.findById(id);
            if (!cart) {
                throw new ErrorManager("Carrito no encontrado.", 404);
            }

            cart.products = [];
            await cart.save();

            return cart;
        } catch (error) {
            throw new ErrorManager(error.message, error.code);
        }
    }

}