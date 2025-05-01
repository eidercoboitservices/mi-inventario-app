import React from 'react';
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
import { Link } from 'react-router-dom';

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
    warehouses,
    movements,
    inventory,
    getLowStockProducts
  } = useInventory();

  const { user } = useAuth();

  const handleBackup = () => {
    // @ts-ignore
    window.api.backup();
  };

  const handleRestore = () => {
    // @ts-ignore
    window.api.restore();
  };

  const totalStockValue = inventory.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const recentMovements = [...movements]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const lowStockProducts = getLowStockProducts();

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const thisMonthMovements = movements.filter(m => {
    const moveDate = new Date(m.createdAt);
    return moveDate.getMonth() === currentMonth && moveDate.getFullYear() === currentYear;
  });

  const totalEntries = thisMonthMovements
    .filter(m => m.type === 'in')
    .reduce((sum, m) => sum + m.quantity, 0);

  const totalExits = thisMonthMovements
    .filter(m => m.type === 'out')
    .reduce((sum, m) => sum + m.quantity, 0);

  return (
    <div>
      <div className="flex justify-end gap-2 mb-4">
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

      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-800">{products.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-md">
              <Box className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/inventory/products" className="text-sm text-blue-600 hover:text-blue-800">
              View all products →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Warehouses</p>
              <p className="text-2xl font-semibold text-gray-800">{warehouses.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-md">
              <WarehouseIcon className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/inventory/products" className="text-sm text-green-600 hover:text-green-800">
              View warehouses →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Stock Value</p>
              <p className="text-2xl font-semibold text-gray-800">${totalStockValue.toFixed(2)}</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-md">
              <Package className="w-6 h-6 text-amber-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/inventory/products" className="text-sm text-amber-600 hover:text-amber-800">
              View inventory →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-5">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-semibold text-gray-800">{lowStockProducts.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-md">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link to="/inventory/products" className="text-sm text-red-600 hover:text-red-800">
              View alerts →
            </Link>
          </div>
        </div>
      </div>

      {/* Monthly Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Monthly Activity</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-md mr-3">
                  <ArrowDownCircle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Entries</p>
                  <p className="text-xl font-semibold text-gray-800">{totalEntries}</p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="bg-red-100 p-2 rounded-md mr-3">
                  <ArrowUpCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Exits</p>
                  <p className="text-xl font-semibold text-gray-800">{totalExits}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
          {lowStockProducts.length > 0 ? (
            <ul className="space-y-3">
              {lowStockProducts.slice(0, 4).map(product => {
                const stock = inventory
                  .filter(i => i.productId === product.id)
                  .reduce((total, item) => total + item.quantity, 0);
                return (
                  <li key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-2 rounded-md mr-3">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-800">{product.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">Stock: </span>
                      <span className="ml-1 text-sm font-semibold text-red-600">{stock}</span>
                      <span className="ml-1 text-sm text-gray-600">/ {product.minStock}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No low stock items
            </div>
          )}
          {lowStockProducts.length > 4 && (
            <div className="mt-4 text-right">
              <Link to="/inventory/products" className="text-sm text-blue-600 hover:underline">
                View all alerts →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recent Movements</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentMovements.length > 0 ? recentMovements.map(movement => {
                const product = products.find(p => p.id === movement.productId);
                const warehouse = warehouses.find(w => w.id === movement.warehouseId);
                return (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(movement.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{product?.name || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === 'in' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.type === 'in' ? 'Entry' : 'Exit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{movement.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{warehouse?.name || 'Unknown'}</td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No recent movements
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 text-right">
          <Link to="/reports/history" className="text-sm text-blue-600 hover:underline">
            View all movements →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
