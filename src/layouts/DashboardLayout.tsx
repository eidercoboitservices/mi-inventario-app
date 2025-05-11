import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Home, 
  Box, 
  ArrowRightLeft, 
  ClipboardList, 
  Users,
  User, 
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  Building
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useInventory } from '../contexts/InventoryContext';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { getLowStockProducts } = useInventory();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const lowStockProducts = getLowStockProducts();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `flex items-center px-4 py-2 mt-2 text-sm font-semibold rounded-lg ${
      isActive 
        ? 'text-white bg-blue-600 hover:bg-blue-700' 
        : 'text-gray-700 bg-transparent hover:bg-gray-100'
    }`;

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white border-r lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <span className="text-lg font-bold text-gray-800">InventoryPro</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <NavLink to="/dashboard" className={navLinkClass}>
            <Home className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          
          <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Inventory
          </div>
          
          <NavLink to="/inventory/products" className={navLinkClass}>
            <Box className="w-5 h-5 mr-3" />
            Products
          </NavLink>
          
          <NavLink to="/inventory/warehouses" className={navLinkClass}>
            <Building className="w-5 h-5 mr-3" />
            Warehouses
          </NavLink>
          
          <NavLink to="/inventory/movements" className={navLinkClass}>
            <ArrowRightLeft className="w-5 h-5 mr-3" />
            Movements
          </NavLink>
          
          <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Reports
          </div>
          
          <NavLink to="/reports/history" className={navLinkClass}>
            <ClipboardList className="w-5 h-5 mr-3" />
            History
          </NavLink>
          
          {user?.role === 'admin' && (
            <>
              <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Administration
              </div>
              
              <NavLink to="/admin/users" className={navLinkClass}>
                <Users className="w-5 h-5 mr-3" />
                Users
              </NavLink>
            </>
          )}
          
          <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Account
          </div>
          
          <NavLink to="/profile" className={navLinkClass}>
            <User className="w-5 h-5 mr-3" />
            Profile
          </NavLink>
          
          <NavLink to="/subscription" className={navLinkClass}>
            <CreditCard className="w-5 h-5 mr-3" />
            Subscription
          </NavLink>
          
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 focus:outline-none lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex text-gray-600 focus:outline-none">
                <Bell className="h-6 w-6" />
                {lowStockProducts.length > 0 && (
                  <span className="absolute top-0 right-0 inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>
            
            <div className="relative">
              <button className="flex items-center text-gray-700 focus:outline-none">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {user?.name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user?.name}</span>
                </div>
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
