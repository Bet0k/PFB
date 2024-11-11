import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();

const cartManager = new CartManager();

router.get("/", async (req, res) => {
    try {
        const carts = await cartManager.getAll();
        res.status(200).json({ status:  "success", payload: carts });
    } catch (error) {
        res.status(error.code || 500).json({ status:  "error", message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    try {
        const cart = await cartManager.getOneById(Number((req.params.pid)));
        res.status(200).json({ status:  "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status:  "error", message: error.message });
    }
});

router.post("/add", async (req, res) => {
    try {
        const cart = await cartManager.insertOne(req.body, req.file);
        res.status(201).json({ status:  "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status:  "error", message: error.message });
    }
});

router.post("/:cid/update/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateCart(cid, pid, quantity);
        res.status(200).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(error.code || 500).json({ status: "error", message: error.message });
    }
});

export default router;