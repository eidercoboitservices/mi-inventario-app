const express = require('express');
const router = express.Router();
const { Pool } = require('pg');

// Configura tu conexión a PostgreSQL
const db = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventario',
  password: 'Edcc02novoa@',
  port: 5432,
});

// Obtener todas las bodegas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM warehouses ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener bodegas' });
  }
});

// Crear bodega
router.post('/', async (req, res) => {
  const { name, location } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO warehouses (name, location) VALUES ($1, $2) RETURNING *',
      [name, location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear bodega' });
  }
});

// Editar bodega
router.put('/:id', async (req, res) => {
  const { name, location } = req.body;
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE warehouses SET name = $1, location = $2 WHERE id = $3 RETURNING *',
      [name, location, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar bodega' });
  }
});

// Eliminar bodega
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM warehouses WHERE id = $1', [id]);
    res.json({ message: 'Bodega eliminada' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar bodega' });
  }
});

module.exports = router;
