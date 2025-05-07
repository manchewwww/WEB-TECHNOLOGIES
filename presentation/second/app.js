const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const cors = require('cors');
let products = [];
let id = 1;

const app = express();
const port = 3000;
app.use(express.json());
app.use(cors());

const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

app.post('/api/products', (req, res) => {
    const { name, price } = req.body;

    if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required' });
    }

    const newProduct = {
        id: id++,
        name,
        price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (name) product.name = name;
    if (price) product.price = price;

    res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    const deletedProduct = products.splice(index, 1);
    res.json({ message: 'Product deleted', product: deletedProduct[0] });
});

app.get('/swagger.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, '/swagger.yaml'));
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/swagger`);
});
