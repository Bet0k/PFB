const productsList = document.getElementById("products-list");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");

const escapeHTML = (str) => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const loadProductsList = async () => {
    const response = await fetch("/api/products", { method: "GET" });
    const data = await response.json();
    const products = data.payload || [];

    productsList.innerHTML = `
        <table>
            <thead>
                <tr>
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

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
});

loadProductsList();