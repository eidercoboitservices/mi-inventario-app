import React, { useEffect, useState } from 'react';
import { Building } from 'lucide-react';


type Warehouse = {
  id: number;
  name: string;
  location: string;
};

export default function Warehouses() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  const fetchWarehouses = async () => {
    const res = await fetch('http://localhost:3001/api/warehouses');
    const data = await res.json();
    setWarehouses(data);
  };

  const createWarehouse = async () => {
    if (!name) return;
    await fetch('http://localhost:3001/api/warehouses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, location }),
    });
    setName('');
    setLocation('');
    fetchWarehouses();
  };

  const deleteWarehouse = async (id: number) => {
    await fetch(`http://localhost:3001/api/warehouses/${id}`, {
      method: 'DELETE',
    });
    fetchWarehouses();
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Gestión de Bodegas</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre de la bodega"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border px-2 py-1 mr-2"
        />
        <button onClick={createWarehouse} className="bg-blue-500 text-white px-4 py-1 rounded">
          Crear
        </button>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Ubicación</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {warehouses.map((w) => (
            <tr key={w.id}>
              <td className="border px-4 py-2">{w.id}</td>
              <td className="border px-4 py-2">{w.name}</td>
              <td className="border px-4 py-2">{w.location}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => deleteWarehouse(w.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
