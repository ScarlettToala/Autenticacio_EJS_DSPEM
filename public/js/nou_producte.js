const form = document.getElementById('addProductForm');
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const res = await fetch('/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(text);
        }

        alert('Producte afegit correctament!');
        window.location.href = '/products';

    } catch (error) {
        alert('Error: ' + error.message);
    }
});