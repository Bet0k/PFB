const socket = io();

socket.on("connect", () => {
    console.log("Conectado al servidor");
});

socket.on("disconnect", () => {
    console.log("Desconectado del servidor");
});

const escapeHTML = (str) => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const handleProductsList = (data) => {
    console.log(data);
    const products = data.products.payload || [];
    const productsList = document.getElementById("products-list");
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
                        <td>${escapeHTML(product._id)}</td>
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
};


socket.on("products-list", handleProductsList);

const handleInsertProduct = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const errorMessage = document.getElementById("error-message");
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
};

const productsForm = document.getElementById("products-form");
productsForm.addEventListener("submit", handleInsertProduct);

socket.on("error-message", (data) => {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = data.message;
});

const handleDeleteProduct = () => {
    const inputProductID = document.getElementById("input-product-id");
    const errorMessage = document.getElementById("error-message");
    const id = inputProductID.value;
    inputProductID.value = "";
    errorMessage.innerText = "";

    if (id) {
        socket.emit("delete-product", {
            id
        });
    } else {
        errorMessage.innerText = "Por favor, ingresa un ID válido.";
    }
};


const btnDeleteProduct = document.getElementById("btn-delete-product");
btnDeleteProduct.addEventListener("click", handleDeleteProduct);