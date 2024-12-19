import {
    Router
} from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/pushProduct", async (req, res) => {
    try {
        res.status(200).render("addProducts", {
            title: "Ingresar Productos"
        });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        const cleanProducts = products.payload.map(product => product._doc);
        res.status(200).render("product", {
            title: "Todos los productos",
            products: cleanProducts
        });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});


router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params?.pid);
        res.status(200).render("totalInfoProduct", {
            title: "Detalles del Producto",
            product: product.toObject()
        });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});



export default router;