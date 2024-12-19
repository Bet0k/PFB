import express from "express";
import {
    connectDB
} from "./config/mongoose.config.js";
import routerProducts from "./routes/products.router.js";
import routerCart from "./routes/cart.router.js";
import routerViewProducts from "./routes/products.view.router.js";
import routerViewCart from "./routes/cart.view.router.js"
import paths from "./utils/paths.js";
import routerViewHome from "./routes/home.view.router.js";
import {
    config as configHandlebars
} from "./config/handlebars.config.js";
import {
    config as configWebsocket
} from "./config/websocket.config.js";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
connectDB();
configHandlebars(app);
app.use("/", routerViewHome);
app.use("/api/public", express.static(paths.public));
app.use("/api/products", routerProducts);
app.use("/api/cart", routerCart);
app.use("/products", routerViewProducts);
app.use("/view/cart", routerViewCart);
//Siempre al final, porque el código se ejecuta de arriba a abajo, y si está arriba resuelve todas con 404
app.use("*", (req, res) => {
    res.status(404).render("error404", {
        title: "Error 404"
    });
});

// app.listen(PORT, () => {
//     console.log(`Ejecutándose en http://localhost:${PORT}`);
// });
const httpServer = app.listen(PORT, () => {
    console.log(`Ejecutándose en http://localhost:${PORT}`);
});
configWebsocket(httpServer);