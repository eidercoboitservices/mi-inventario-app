import React, { useState } from 'react';
import { 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Plus, 
  Search,
  Package
} from 'lucide-react';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';

const MovementModal = ({ 
  isOpen, 
  onClose, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (movementData: any) => void; 
}) => {
  const { products, warehouses, getProductStock } = useInventory();
  
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    type: 'in' as 'in' | 'out',
    quantity: 1,
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
    onClose();
  };
  
  // Get current stock for selected product and warehouse
  const currentStock = formData.productId && formData.warehouseId
    ? getProductStock(formData.productId, formData.warehouseId)
    : 0;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Record Inventory Movement
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Movement Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`
                  relative border rounded-md px-4 py-3 flex cursor-pointer focus:outline-none
                  ${formData.type === 'in' 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'border-gray-200'
                  }
                `}>
                  <input
                    type="radio"
                    name="type"
                    value="in"
                    checked={formData.type === 'in'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <ArrowDownCircle className={`mr-2 h-5 w-5 ${formData.type === 'in' ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div className="text-sm font-medium">Entry (In)</div>
                  </div>
                </label>
                
                <label className={`
                  relative border rounded-md px-4 py-3 flex cursor-pointer focus:outline-none
                  ${formData.type === 'out' 
                    ? 'bg-red-50 border-red-200' 
                    : 'border-gray-200'
                  }
                `}>
                  <input
                    type="radio"
                    name="type"
                    value="out"
                    checked={formData.type === 'out'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <ArrowUpCircle className={`mr-2 h-5 w-5 ${formData.type === 'out' ? 'text-red-600' : 'text-gray-400'}`} />
                    <div className="text-sm font-medium">Exit (Out)</div>
                  </div>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                Product *
              </label>
              <select
                id="productId"
                name="productId"
                required
                value={formData.productId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a product</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-700 mb-1">
                Warehouse *
              </label>
              <select
                id="warehouseId"
                name="warehouseId"
                required
                value={formData.warehouseId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a warehouse</option>
                {warehouses.map(warehouse => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name} ({warehouse.location})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                required
                min={1}
                max={formData.type === 'out' ? currentStock : undefined}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              
              {formData.type === 'out' && formData.productId && formData.warehouseId && (
                <p className="mt-1 text-sm text-gray-500">
                  Current stock: {currentStock}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional notes about this movement"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (formData.type === 'out' && formData.quantity > currentStock)}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading || (formData.type === 'out' && formData.quantity > currentStock) 
                  ? 'opacity-75 cursor-not-allowed' 
                  : ''
              }`}
            >
              {loading ? 'Saving...' : 'Record Movement'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Movements = () => {
  const { products, warehouses, addMovement, movements } = useInventory();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'in' | 'out'>('all');
  
  // Format date
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
  
  const handleSaveMovement = async (movementData: any) => {
    await addMovement(movementData);
  };
  
  // Filter movements
  const filteredMovements = movements
    .filter(movement => {
      // Filter by type
      if (filterType !== 'all' && movement.type !== filterType) {
        return false;
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
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Inventory Movements</h1>
          <p className="text-gray-600">Track and record product entries and exits</p>
        </div>
        
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 mr-2" />
          Record Movement
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
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
                    ? 'bg-blue-600 text-white'
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
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                } border-t border-b border-r border-gray-300`}
              >
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Exits
              </button>
            </div>
          </div>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(movement.createdAt)}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {warehouse?.name || 'Unknown warehouse'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {movement.notes || '-'}
                    </td>
                  </tr>
                );
              })}
              
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                    No movements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {modalOpen && (
        <MovementModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveMovement}
        />
      )}
    </div>
  );
};

export default Movements;