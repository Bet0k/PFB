import {
    Router
} from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const cart = await cartManager.getAll();
        res.render("cart", {
            title: "Carrito de Compras",
            cart
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});

router.get("/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(req.params.cid);

        const cartData = {
            ...cart.toObject(),
            products: cart.products.map(product => ({
                ...product.toObject(),
                productId: product.productId.toObject()
            }))
        };

        console.log("Datos del carrito en el backend:", cartData);

        res.render("cartInfo", {
            title: "Detalle del Carrito",
            cart: cartData
        });
    } catch (error) {
        console.error(error);
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});



router.get("/newCart", (req, res) => {
    res.render("createCart", {
        title: "Nuevo Carrito"
    });
});


export default router;