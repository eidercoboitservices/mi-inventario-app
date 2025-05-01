import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

// Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  minStock: number;
  createdAt: string;
}

export interface Warehouse {
  id: string;
  name: string;
  location: string;
}

export interface InventoryItem {
  productId: string;
  warehouseId: string;
  quantity: number;
}

export interface Movement {
  id: string;
  productId: string;
  warehouseId: string;
  type: 'in' | 'out';
  quantity: number;
  notes: string;
  userId: string;
  createdAt: string;
}

interface InventoryContextType {
  products: Product[];
  warehouses: Warehouse[];
  inventory: InventoryItem[];
  movements: Movement[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Omit<Product, 'id' | 'createdAt'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addWarehouse: (warehouse: Omit<Warehouse, 'id'>) => Promise<void>;
  addMovement: (movement: Omit<Movement, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  getProductStock: (productId: string, warehouseId?: string) => number;
  getLowStockProducts: () => Product[];
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

// Mock data - In a real application, this would come from an API
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Laptop HP 15"',
    sku: 'LPT-HP-15',
    description: 'HP laptop with 15" screen, i5 processor',
    category: 'Electronics',
    price: 899.99,
    minStock: 5,
    createdAt: '2023-05-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Office Chair',
    sku: 'FRN-CHR-01',
    description: 'Ergonomic office chair with lumbar support',
    category: 'Furniture',
    price: 199.99,
    minStock: 10,
    createdAt: '2023-06-20T14:45:00Z'
  }
];

const mockWarehouses: Warehouse[] = [
  { id: '1', name: 'Main Warehouse', location: 'New York' },
  { id: '2', name: 'Secondary Storage', location: 'Los Angeles' }
];

const mockInventory: InventoryItem[] = [
  { productId: '1', warehouseId: '1', quantity: 12 },
  { productId: '1', warehouseId: '2', quantity: 3 },
  { productId: '2', warehouseId: '1', quantity: 8 }
];

const mockMovements: Movement[] = [
  {
    id: '1',
    productId: '1',
    warehouseId: '1',
    type: 'in',
    quantity: 15,
    notes: 'Initial stock',
    userId: '1',
    createdAt: '2023-05-16T09:00:00Z'
  },
  {
    id: '2',
    productId: '1',
    warehouseId: '1',
    type: 'out',
    quantity: 3,
    notes: 'Order #12345',
    userId: '2',
    createdAt: '2023-06-01T11:30:00Z'
  }
];

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(mockWarehouses);
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [movements, setMovements] = useState<Movement[]>(mockMovements);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    const savedWarehouses = localStorage.getItem('warehouses');
    const savedInventory = localStorage.getItem('inventory');
    const savedMovements = localStorage.getItem('movements');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedWarehouses) setWarehouses(JSON.parse(savedWarehouses));
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    if (savedMovements) setMovements(JSON.parse(savedMovements));
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('warehouses', JSON.stringify(warehouses));
    localStorage.setItem('inventory', JSON.stringify(inventory));
    localStorage.setItem('movements', JSON.stringify(movements));
  }, [products, warehouses, inventory, movements]);

  const addProduct = async (product: Omit<Product, 'id' | 'createdAt'>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast.success(`Product ${newProduct.name} added successfully`);
  };

  const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...productData } : product
      )
    );
    
    toast.success('Product updated successfully');
  };

  const deleteProduct = async (id: string) => {
    // Check if product has inventory or movements
    const hasInventory = inventory.some(item => item.productId === id);
    const hasMovements = movements.some(move => move.productId === id);
    
    if (hasInventory || hasMovements) {
      toast.error('Cannot delete product with existing inventory or movements');
      throw new Error('Cannot delete product with existing inventory or movements');
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setProducts(prev => prev.filter(product => product.id !== id));
    toast.success('Product deleted successfully');
  };

  const addWarehouse = async (warehouse: Omit<Warehouse, 'id'>) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newWarehouse: Warehouse = {
      ...warehouse,
      id: Math.random().toString(36).substr(2, 9)
    };
    
    setWarehouses(prev => [...prev, newWarehouse]);
    toast.success(`Warehouse ${newWarehouse.name} added successfully`);
  };

  const addMovement = async (movementData: Omit<Movement, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) {
      toast.error('You must be logged in to add movements');
      throw new Error('Not authenticated');
    }
    
    // Validate product and warehouse exist
    const productExists = products.some(p => p.id === movementData.productId);
    const warehouseExists = warehouses.some(w => w.id === movementData.warehouseId);
    
    if (!productExists || !warehouseExists) {
      toast.error('Invalid product or warehouse');
      throw new Error('Invalid product or warehouse');
    }
    
    // For 'out' movement, validate there is enough stock
    if (movementData.type === 'out') {
      const currentStock = getProductStock(movementData.productId, movementData.warehouseId);
      if (currentStock < movementData.quantity) {
        toast.error('Insufficient stock for this movement');
        throw new Error('Insufficient stock');
      }
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMovement: Movement = {
      ...movementData,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    
    setMovements(prev => [...prev, newMovement]);
    
    // Update inventory
    const inventoryItem = inventory.find(
      item => item.productId === movementData.productId && item.warehouseId === movementData.warehouseId
    );
    
    if (inventoryItem) {
      // Update existing inventory item
      setInventory(prev => 
        prev.map(item => 
          (item.productId === movementData.productId && item.warehouseId === movementData.warehouseId)
            ? { 
                ...item, 
                quantity: item.quantity + (movementData.type === 'in' ? movementData.quantity : -movementData.quantity) 
              }
            : item
        )
      );
    } else if (movementData.type === 'in') {
      // Create new inventory item (only for 'in' movements)
      setInventory(prev => [
        ...prev,
        {
          productId: movementData.productId,
          warehouseId: movementData.warehouseId,
          quantity: movementData.quantity
        }
      ]);
    }
    
    toast.success('Movement recorded successfully');
  };

  const getProductStock = (productId: string, warehouseId?: string): number => {
    if (warehouseId) {
      // Get stock in specific warehouse
      const item = inventory.find(
        i => i.productId === productId && i.warehouseId === warehouseId
      );
      return item ? item.quantity : 0;
    } else {
      // Get total stock across all warehouses
      return inventory
        .filter(i => i.productId === productId)
        .reduce((total, item) => total + item.quantity, 0);
    }
  };

  const getLowStockProducts = (): Product[] => {
    return products.filter(product => {
      const totalStock = getProductStock(product.id);
      return totalStock < product.minStock;
    });
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        products, 
        warehouses, 
        inventory, 
        movements, 
        addProduct, 
        updateProduct, 
        deleteProduct, 
        addWarehouse, 
        addMovement, 
        getProductStock, 
        getLowStockProducts 
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};