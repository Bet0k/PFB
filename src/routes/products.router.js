import {
    Router
} from "express";
import uploader from "../utils/uploader.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.headers["limit"]) || 10;
        const page = parseInt(req.headers["page"]) || 1;
        const skip = (page - 1) * limit;

        let sort = req.headers["sort"];
        if (sort) {
            sort = sort === "desc" ? -1 : 1;
        } else {
            sort = null;
        }

        const params = {
            title: req.headers["title"],
            description: req.headers["description"],
            category: req.headers["category"],
            price: req.headers["price"],
        };

        const products = await productManager.getAll(params, limit, sort, page);

        res.status(200).json({
            status: "success",
            payload: products
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});


router.get("/:pid", async (req, res) => {
    try {
        const product = await productManager.getOneById(req.params?.pid);
        res.status(200).json({
            status: "success",
            payload: product
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});

router.post("/newProduct", async (req, res) => {
    try {
        const product = await productManager.insertOne(req.body);
        res.status(201).json({
            status: "success",
            payload: product
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});


router.put("/:pid", async (req, res) => {
    try {
        const product = await productManager.updateOneById(req.params?.pid, req.body);
        res.status(200).json({
            status: "success",
            payload: product
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
        const product = await productManager.deleteOneById(req.params?.pid);
        res.status(200).json({
            status: "success",
            message: "Producto eliminado correctamente.",
            payload: product
        });
    } catch (error) {
        res.status(error.code || 500).json({
            status: "error",
            message: error.message
        });
    }
});

export default router;