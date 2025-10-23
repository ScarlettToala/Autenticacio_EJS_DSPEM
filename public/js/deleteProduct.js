function deleteProduct(id) {
    if (!confirm('Estás seguro que quieres eliminar este producto?')) return;

    fetch(`/products/${id}`, {
        method: 'DELETE',
        credentials: 'include', //esto es importante para enviar la cookie JWT
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('No se pudo eliminar el producto');
            return res.json();
        })
        .then(data => {
            alert(data.message);
            window.location.href = '/products'; // Volver al listado
        })
        .catch(err => alert(err.message));
}