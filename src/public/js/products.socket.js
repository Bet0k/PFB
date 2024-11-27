const socket = io();

socket.on("connect", () =>{
    console.log("Conetado al servidor");
});

socket.on("disconnect", () =>{
    console.log("Desconectado del servidor");
});

const productsList = document.getElementById("products-list");
const productsForm = document.getElementById("products-form");
const errorMessage = document.getElementById("error-message");
const inputProductID = document.getElementById("input-product-id");
const btnDeleteProduct = document.getElementById("btn-delete-product");

const escapeHTML = (str) => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

socket.on("products-list", (data) => {
    const products = data.products || [];
    productsList.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Descripción</th>
                    <th>Código</th>
                    <th>Precio</th>
                    <th>Status</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                </tr>
            </thead>
            <tbody>
                ${products.map((product) => `
                    <tr>
                        <td>${escapeHTML(product.id)}</td>
                        <td>${escapeHTML(product.title)}</td>
                        <td>${escapeHTML(product.description)}</td>
                        <td>${escapeHTML(product.code)}</td>
                        <td>${escapeHTML(product.price)}</td>
                        <td>${escapeHTML(product.status)}</td>
                        <td>${escapeHTML(product.stock)}</td>
                        <td>${escapeHTML(product.category)}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
});

productsForm.addEventListener("submit", (event) =>{
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    errorMessage.innerText = "";
    form.reset();

    socket.emit("insert-product", {
        title: formData.get("title"),
        description: formData.get("description"),
        code: formData.get("code"),
        price: Number(formData.get("price")),
        status: formData.get("status") === "on",
        stock: formData.get("stock"),
        category: formData.get("category"),
    });
});

socket.on("error-message", (data) =>{
    errorMessage.innerText = data.message;
});

btnDeleteProduct.addEventListener("click", () =>{
    const id = inputProductID.value;
    inputProductID.innerText = "";
    errorMessage.innerText = "";

    if(id > 0) {
        socket.emit("delete-product", { id });
    }
});