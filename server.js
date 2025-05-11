const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Importa las rutas de bodegas (las crearemos en el siguiente paso)
const warehousesRoutes = require('./routes/warehouses');
app.use('/api/warehouses', warehousesRoutes);

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});
