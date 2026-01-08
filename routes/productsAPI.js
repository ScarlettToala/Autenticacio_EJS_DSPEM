import express from 'express';
import fs from 'fs';

const router = express.Router();

const readData = () =>
  JSON.parse(fs.readFileSync('./db/db.json'));

const writeData = (data) =>
  fs.writeFileSync('./db/db.json', JSON.stringify(data, null, 2));

/* ===== GET todos los productos ===== */
router.get('/', (req, res) => {
  console.log("ENTRO A /api/products");
  const data = readData();
  res.json(data.products);
});

/* ===== GET producto por ID ===== */
router.get('/:id', (req, res) => {
  const data = readData();
  const product = data.products.find(
    p => p.id === parseInt(req.params.id)
  );

  if (!product) {
    return res.status(404).json({ error: 'Not found' });
  }

  res.json(product);
});

/* ===== POST crear producto ===== */
router.post('/', (req, res) => {
  const { name, price, category } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'All fields required' });
  }

  const data = readData();
  const newId =
    Math.max(0, ...data.products.map(p => p.id)) + 1;

  const newProduct = { id: newId, name, price, category };
  data.products.push(newProduct);

  writeData(data);
  res.status(201).json(newProduct);
});

/* ===== PUT actualizar ===== */
router.put('/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);

  const index = data.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  data.products[index] = {
    ...data.products[index],
    ...req.body
  };

  writeData(data);
  res.json(data.products[index]);
});

/* ===== DELETE ===== */
router.delete('/:id', (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id);

  const index = data.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Not found' });
  }

  data.products.splice(index, 1);
  writeData(data);

  res.json({ message: 'Deleted' });
});

export default router;
