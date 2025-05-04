import {
  Box,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  AlertTriangle,
  Warehouse as WarehouseIcon
} from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const Dashboard = () => {
  const {
    products,
    movements,
    inventory,
    config
  } = useInventory();

  const { user } = useAuth();

  const LOW_STOCK_THRESHOLD = config?.lowStockThreshold || 5;

  const lowStockProducts = products.filter(p => {
    const item = inventory.find(i => i.productId === p.id);
    return item && item.quantity <= LOW_STOCK_THRESHOLD;
  });

  const handleBackup = () => {
    // @ts-ignore
    window.api.backup();
  };

  const handleRestore = async () => {
    // @ts-ignore
    const restored = await window.api.restore();
    if (restored) {
      alert('Respaldo restaurado correctamente');
      window.location.reload(); // 🔄 Recarga la interfaz para reflejar cambios
    } else {
      alert('No se pudo restaurar el respaldo');
    }
  };

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={handleBackup}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Crear copia de seguridad
        </button>
        <button
          onClick={handleRestore}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
        >
          Restaurar respaldo
        </button>
      </div>

      {lowStockProducts.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 mb-6 rounded">
          <div className="flex items-center">
            <AlertTriangle className="mr-2" />
            <div>
              <p className="font-semibold">¡Atención!</p>
              <ul className="list-disc list-inside text-sm mt-1">
                {lowStockProducts.map(p => {
                  const stock = inventory.find(i => i.productId === p.id)?.quantity || 0;
                  return (
                    <li key={p.id}>
                      <strong>{p.name}</strong> tiene bajo inventario ({stock} unidades).
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Movimientos recientes</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentMovements.map((movement, idx) => {
              const product = products.find(p => p.id === movement.productId);
              return (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{product?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      movement.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {movement.type === 'in' ? 'Entry' : 'Exit'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(movement.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
