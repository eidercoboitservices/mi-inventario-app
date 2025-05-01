import React, { useState } from 'react';
import { 
  Search, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Calendar, 
  Package,
  Download,
  Warehouse as WarehouseIcon,
  User
} from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';

const History = () => {
  const { products, warehouses, movements } = useInventory();
  const { user } = useAuth();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  const [filterProduct, setFilterProduct] = useState<string>('');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format date for input field
  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };
  
  // Filter movements based on criteria
  const filteredMovements = movements
    .filter(movement => {
      // Filter by type
      if (filterType !== 'all' && movement.type !== filterType) {
        return false;
      }
      
      // Filter by product
      if (filterProduct && movement.productId !== filterProduct) {
        return false;
      }
      
      // Filter by warehouse
      if (filterWarehouse && movement.warehouseId !== filterWarehouse) {
        return false;
      }
      
      // Filter by date range
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        const movementDate = new Date(movement.createdAt);
        if (movementDate < fromDate) {
          return false;
        }
      }
      
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        const movementDate = new Date(movement.createdAt);
        if (movementDate > toDate) {
          return false;
        }
      }
      
      // Filter by search term
      if (searchTerm) {
        const product = products.find(p => p.id === movement.productId);
        const warehouse = warehouses.find(w => w.id === movement.warehouseId);
        
        const searchFields = [
          product?.name || '',
          product?.sku || '',
          warehouse?.name || '',
          movement.notes
        ].map(field => field.toLowerCase());
        
        return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
      }
      
      return true;
    })
    // Sort by date, newest first
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Export to Excel (CSV)
  const exportToCSV = () => {
    // Create CSV content
    const csvHeader = [
      'Date',
      'Product Name',
      'SKU',
      'Type',
      'Quantity',
      'Warehouse',
      'Notes',
      'User'
    ].join(',');
    
    const csvRows = filteredMovements.map(movement => {
      const product = products.find(p => p.id === movement.productId);
      const warehouse = warehouses.find(w => w.id === movement.warehouseId);
      const moveUser = { name: 'System' }; // In a real app, this would come from users data
      
      const row = [
        formatDate(movement.createdAt),
        `"${product?.name || 'Unknown product'}"`,
        `"${product?.sku || ''}"`,
        movement.type === 'in' ? 'Entry' : 'Exit',
        movement.quantity,
        `"${warehouse?.name || 'Unknown warehouse'}"`,
        `"${movement.notes || ''}"`,
        `"${moveUser.name}"`
      ];
      
      return row.join(',');
    });
    
    const csvContent = [csvHeader, ...csvRows].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', `inventory_movements_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterProduct('');
    setFilterWarehouse('');
    setFilterDateFrom('');
    setFilterDateTo('');
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Movement History</h1>
          <p className="text-gray-600">View and export detailed movement records</p>
        </div>
        
        <button
          onClick={exportToCSV}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="w-4 h-4 mr-2" />
          Export to Excel
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filterProduct" className="block text-sm font-medium text-gray-700 mb-1">
                Product
              </label>
              <select
                id="filterProduct"
                value={filterProduct}
                onChange={(e) => setFilterProduct(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Products</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filterWarehouse" className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse
              </label>
              <select
                id="filterWarehouse"
                value={filterWarehouse}
                onChange={(e) => setFilterWarehouse(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">All Warehouses</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="filterDateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="filterDateFrom"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="filterDateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="filterDateTo"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search movements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setFilterType('all')}
                className={`inline-flex items-center py-2 px-4 text-sm font-medium rounded-l-md ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilterType('in')}
                className={`inline-flex items-center py-2 px-4 text-sm font-medium ${
                  filterType === 'in'
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-r border-gray-300`}
              >
                <ArrowDownCircle className="w-4 h-4 mr-2" />
                Entries
              </button>
              <button
                type="button"
                onClick={() => setFilterType('out')}
                className={`inline-flex items-center py-2 px-4 text-sm font-medium rounded-r-md ${
                  filterType === 'out'
                    ? 'bg-red-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-r border-gray-300`}
              >
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Exits
              </button>
            </div>
            
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-800">
            Movement Records {filteredMovements.length > 0 && `(${filteredMovements.length})`}
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Warehouse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMovements.map((movement) => {
                const product = products.find(p => p.id === movement.productId);
                const warehouse = warehouses.find(w => w.id === movement.warehouseId);
                
                return (
                  <tr key={movement.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{formatDate(movement.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {product?.name || 'Unknown product'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product?.sku || ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        movement.type === 'in' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {movement.type === 'in' ? (
                          <ArrowDownCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <ArrowUpCircle className="w-3 h-3 mr-1" />
                        )}
                        {movement.type === 'in' ? 'Entry' : 'Exit'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {movement.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <WarehouseIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">
                          {warehouse?.name || 'Unknown warehouse'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">
                          {movement.userId === user?.id ? user?.name : 'Other User'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                );
              })}
              
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No movements found matching the current filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;