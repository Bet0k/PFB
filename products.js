const products = [
    {
        id: 1,
        product: "Torta Brownie",
        price: 20000,
    },
    {
        id: 2,
        product: "Cheesecake",
        price: 30000,
    },
    {
        id: 3,
        product: "Lemon Pie",
        price: 25000,
    }
];

const generateId = () => {
    let maxId = 0;

    products.forEach((product) => {
        if (product.id > maxId) {
            maxId = product.id;
        }
    });

    return maxId + 1;
};

export { products, generateId };