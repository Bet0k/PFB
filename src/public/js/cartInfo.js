document.getElementById('clear-cart').addEventListener('click', () => {
    const cartId = localStorage.getItem('cartId');

    if (!cartId) {
        alert("No se ha creado un carrito.");
        return;
    }

    fetch(`http://localhost:8080/api/cart/${cartId}`)
        .then(response => response.json())
        .then(data => {
            if (!data.payload || !data.payload.products || data.payload.products.length === 0) {
                alert("El carrito no tiene productos para borrar.");
                return;
            }

            fetch(`http://localhost:8080/api/cart/${cartId}/products`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alert('El carrito ha sido vaciado correctamente');
                        document.querySelector('table').innerHTML = "<p>Tu carrito está vacío. ¡Agrega productos!</p>";
                    } else {
                        alert('Hubo un problema al vaciar el carrito');
                    }
                })
                .catch(error => {
                    console.error('Error al vaciar el carrito:', error);
                    alert('Hubo un error al intentar vaciar el carrito');
                });
        })
        .catch(error => {
            console.error('Error al obtener el carrito:', error);
            alert('Hubo un problema al obtener el carrito');
        });
});


document.getElementById('delete-cart').addEventListener('click', () => {
    const cartId = localStorage.getItem('cartId');

    fetch(`http://localhost:8080/api/cart/${cartId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('El carrito ha sido borrado correctamente');
                console.log('Borrando cartId del localStorage');
                localStorage.removeItem('cartId');
                console.log('cartId eliminado del localStorage');
            } else {
                alert('Hubo un problema al borrar el carrito');
            }
        })
});