import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/pushProduct", async (req, res) => {
    try {
        res.status(200).render("addProducts", { title: "Ingresar Productos" });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/", async (req, res) => {
    try {
        const products = await productManager.getAll();
        res.status(200).render("products", { title: "Todos los productos", products });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params?.pid);
        res.status(200).render("product", { title: "Producto", product });
    } catch (error) {
        res.status(error.code || 500).send(`<h1>Error</h1><h3>${error.message}</h3>`);
    }
});

export default router;