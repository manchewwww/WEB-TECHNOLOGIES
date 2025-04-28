const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');


const app = express();
const port = 3000;

const swaggerDocument = YAML.load('./swagger.yaml');

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/swagger.yaml', (req, res) => {
    res.sendFile(path.join(__dirname, '/swagger.yaml'));
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Swagger docs at http://localhost:${port}/api-docs`);
});
