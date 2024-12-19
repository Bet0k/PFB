import {
    Router
} from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.status(200).json({
            status: "success",
            payload: carts
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
        res.status(200).json({
            status: "success",
            payload: cart
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});

router.post("/newCart", async (req, res) => {
    try {
        console.log("Datos recibidos:", req.body);
        if (!req.body || Object.keys(req.body).length === 0 || !req.body.products) {
            res.status(400).json({
                status: "error",
                message: "El carrito no puede crearse sin productos."
            });
        } else {
            const cart = await cartManager.insertOne(req.body);
            res.status(201).json({
                status: "success",
                payload: cart
            });
        }
    } catch (error) {
        console.log("Error al procesar solicitud:", error);
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});


router.post("/:cid/:pid", async (req, res) => {
    try {
        const {
            cid,
            pid
        } = req.params;
        const {
            quantity
        } = req.body;
        const cart = await cartManager.updateCart(cid, pid, quantity);
        res.status(200).json({
            status: "success",
            payload: cart
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});

router.delete("/:pid", async (req, res) => {
    try {
        const cart = await cartManager.deleteOneById(req.params?.pid);
        res.status(200).json({
            status: "success",
            message: "Carrito eliminado correctamente."
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});

router.delete("/:cid/products", async (req, res) => {
    try {
        const {
            cid
        } = req.params;
        const updatedCart = await cartManager.deleteAllProductsFromCart(cid);
        res.status(200).json({
            status: "success",
            message: "Todos los productos han sido eliminados del carrito.",
            payload: updatedCart
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});


export default router;