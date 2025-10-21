import express from 'express';
import fs from 'fs';
import { requireAuth } from '../middlewares/protect.js'; 

const router = express.Router();

const readData = () => JSON.parse(fs.readFileSync('./db/db.json'));
const writeData = (data) => fs.writeFileSync('./db/db.json', JSON.stringify(data));

router.get('/', requireAuth,(req, res) => {

    //Un mensaje HTML que se mostrará en la página.
    const htmlMessage = `<p>Benvingut/da!</p>
                        <a href="/">Home</a>`;
    const data = readData();
    res.render("products", { user, data, htmlMessage });
});

/*
:id → Parámetro dinámico (el ID del producto a editar).
req.params.id → Obtiene el ID desde la URL.
find(...) → Busca en data.products el producto con ese ID.
Si no lo encuentra, responde con 404.
Si lo encuentra, renderiza la vista edit_product con la información.
*/
router.get('/editProducte/:id', requireAuth, (req, res) => {
    const htmlMessage = `<a href="/products">Llistat de productes</a>`;

    const data = readData();
    const product = data.products.find(p => p.id === parseInt(req.params.id));

    if (!product) return res.status(404).send('Producte not found');

    res.render("edit_product", { user, product, htmlMessage });
});

/*Similar al anterior, pero en lugar de editarlo, solo muestra la información del producto.
Usa la vista product.*/
router.get('/:id', requireAuth , (req, res) => {
    const htmlMessage = `<a href="/products">Llistat de productes</a>`;
    const data = readData();
    const product = data.products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');
    res.render("product", { user, product, htmlMessage });
});

/*
Recibe datos desde un formulario o petición POST.
Valida que no falte ningún campo.
Crea un nuevo objeto newProduct con un id nuevo.
Lo agrega al array de productos (data.products).
Guarda en db.json con writeData(data).
Devuelve el producto creado como respuesta JSON.
*/
router.post('/', requireAuth, (req, res) => {
    const data = readData();
    const { name, price, category } = req.body;
    //compureba que esten los 3
    if (!name || !price || !category) return res.status(400).send('All fields are required');
    const newProduct = { id: data.products.length + 1, name, price, category };
    data.products.push(newProduct);
    writeData(data);
    res.json(newProduct);
});

/*
Busca el producto por ID.
Si no existe → responde 404.
Si existe → combina los datos existentes con los nuevos (...spread operator).
Guarda los cambios en db.json.
Redirige al listado de productos.
*/
router.put('/:id', requireAuth,(req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const productIndex = data.products.findIndex(p => p.id === id);
    if (productIndex === -1) return res.status(404).send('Product not found');
    data.products[productIndex] = { ...data.products[productIndex], ...req.body };
    writeData(data);
    //res.json({ message: 'Product updated successfully' });
    res.redirect('/products');
});

/*
Busca el producto por ID.
Si no existe → 404.
Si existe → lo elimina del array con splice.
Actualiza el archivo db.json.
Devuelve un mensaje de éxito.
*/
router.delete('/:id', requireAuth,(req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const productIndex = data.products.findIndex(p => p.id === id);
    if (productIndex === -1) return res.status(404).send('Product not found');
    data.products.splice(productIndex, 1);
    writeData(data);
    res.json({ message: 'Product deleted successfully' });
});

export default router;
