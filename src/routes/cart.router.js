import { Router } from 'express'

const router = Router();

const cart = [];

router.get("", (req, res) => {
    res.status(200).json({ status:  "success", payload: cart});
})


export default router;