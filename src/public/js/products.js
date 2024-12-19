const productsList = document.getElementById("products-list");
const productDetailsSection = document.getElementById("product-details");
const btnRefreshProductsList = document.getElementById("btn-refresh-products-list");
const btnPrevPage = document.getElementById("btn-prev-page");
const btnNextPage = document.getElementById("btn-next-page");
const currentPageDisplay = document.getElementById("current-page");
const btnViewCart = document.getElementById("btn-view-cart");
const btnClearCart = document.getElementById("clear-cart")

let page = 1;
const limit = 5;
const sort = "desc";

const escapeHTML = (str) => {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};

const loadProductsList = async () => {
    const response = await fetch("/api/products", {
        method: "GET",
        headers: {
            "limit": limit.toString(),
            "page": page.toString(),
            "sort": sort
        }
    });

    const data = await response.json();
    const products = data.payload.payload || [];

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
                <th>Más Información</th>
                <th>Acciones</th>
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
                    <td><button class="btn-detail" onclick="window.location.href='/products/${product._id}'">Ver más</button></td>
                    <td><button class="btn-add-to-cart" data-product-id="${product._id}">Añadir al carrito</button></td>
                </tr>
            `).join("")}
        </tbody>
    </table>
`;

    currentPageDisplay.textContent = `Página: ${page}`;

    btnPrevPage.disabled = !data.payload.hasPrevPage;
    btnNextPage.disabled = !data.payload.hasNextPage;

    document.querySelectorAll(".btn-add-to-cart").forEach(button => {
        button.addEventListener("click", (event) => {
            const productId = event.target.getAttribute("data-product-id");
            addToCart(productId);
        });
    });
};

const loadProductDetails = async (productId) => {
    try {
        const response = await fetch(`/api/products/${productId}`);
        const data = await response.json();
        const product = data.payload;

        if (product) {
            productDetailsSection.innerHTML = `
                <h3>Información del Producto</h3>
                <div>
                    <p><strong>Título:</strong> ${escapeHTML(product.title)}</p>
                    <p><strong>Descripción:</strong> ${escapeHTML(product.description)}</p>
                    <p><strong>Código:</strong> ${escapeHTML(product.code)}</p>
                    <p><strong>Precio:</strong> ${escapeHTML(product.price)}</p>
                    <p><strong>Status:</strong> ${escapeHTML(product.status)}</p>
                    <p><strong>Stock:</strong> ${escapeHTML(product.stock)}</p>
                    <p><strong>Categoría:</strong> ${escapeHTML(product.category)}</p>
                </div>
                <button onclick="hideProductDetails()">Cerrar</button>
            `;
            productDetailsSection.style.display = "block";
        } else {
            alert("Producto no encontrado.");
        }
    } catch (error) {
        alert("Error al cargar los detalles del producto.");
        console.error(error);
    }
};

const hideProductDetails = () => {
    productDetailsSection.style.display = "none";
};

const changePage = (direction) => {
    if (direction === "prev" && page > 1) {
        page--;
    } else if (direction === "next") {
        page++;
    }
    loadProductsList();
};

btnPrevPage.addEventListener("click", () => {
    changePage("prev");
});

btnNextPage.addEventListener("click", () => {
    changePage("next");
});

btnRefreshProductsList.addEventListener("click", () => {
    loadProductsList();
});

let cartId = null;

const createCart = async () => {
    console.log("Intentando crear un carrito...");
    try {
        const response = await fetch("http://localhost:8080/api/cart/newCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                products: []
            })
        });

        const data = await response.json();
        console.log("Respuesta al crear carrito:", data);

        if (data.payload && data.payload._id) {
            cartId = data.payload._id;
            localStorage.setItem("cartId", cartId);
            console.log("ID del carrito guardado:", cartId);
        } else {
            console.log("Error: No se recibió _id del carrito.");
            alert("Error al crear el carrito.");
        }
    } catch (error) {
        console.error("Error al crear el carrito:", error);
        alert("Hubo un problema al crear el carrito.");
    }
};


const addToCart = async (productId) => {
    console.log("Intentando añadir al carrito. Cart ID:", cartId, "Producto ID:", productId);

    if (!cartId) {
        alert("Primero crea un carrito.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/cart/${cartId}/${productId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                quantity: 1
            })
        });

        const data = await response.json();

        if (data.status === "success") {
            console.log("Producto añadido al carrito.");
            alert("Producto añadido al carrito.");
        } else {
            console.log("Error al añadir el producto al carrito.");
            alert("Error al añadir el producto al carrito.");
        }
    } catch (error) {
        console.error("Error al añadir al carrito:", error);
        alert("Hubo un problema al añadir el producto al carrito.");
    }
};

document.getElementById("btn-create-cart").addEventListener("click", () => {
    console.log("Botón de crear carrito presionado");
    createCart();
    alert("Carrito Creado! Podes añadir productos ahora.")
});

document.querySelectorAll(".btn-add-to-cart").forEach(button => {
    button.addEventListener("click", (event) => {
        const productId = event.target.getAttribute("data-product-id");
        console.log("Botón añadir al carrito presionado. Producto ID:", productId);
        addToCart(productId);
    });
});

btnViewCart.addEventListener("click", () => {
    console.log("Botón 'Ver Carrito' presionado");
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
        console.log("No se ha creado un carrito todavía.");
        alert("No tienes un carrito creado.");
        return;
    }

    window.location.href = `/view/cart/${cartId}`;
});

loadProductsList();