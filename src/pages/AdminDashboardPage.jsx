import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Printer, 
  MessageCircle, 
  Eye, 
  EyeOff,
  Edit3, 
  Plus, 
  Trash2, 
  Save, 
  FileText, 
  ShieldCheck, 
  Truck, 
  X, 
  AlertCircle,
  TrendingUp,
  Package,
  Glasses,
  Lock,
  LogOut,
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useShop, ORDER_STATUSES } from '../context/ShopContext';
import { printGSTInvoice } from '../utils/invoiceGenerator';
import { getWhatsAppUrl } from '../utils/whatsappHelper';

const ADMIN_PASSWORD = "Aajkalparso@3";

const SAMPLE_IMAGE_PRESETS = [
  { label: "Men's Classic Eyeglasses", url: "/images/products/mens-eyeglasses/mens_eyeglasses_01.png" },
  { label: "Women's Couture Cat-Eye", url: "/images/products/womens-eyeglasses/womens_eyeglasses_01.png" },
  { label: "Unisex Studio Round", url: "/images/products/unisex-eyeglasses/unisex_eyeglasses_01.png" },
  { label: "Kids Flexible Eyewear", url: "/images/products/kids-eyewear/kids_eyewear_01.png" },
  { label: "Men's Polarized Sunglasses", url: "/images/products/mens-sunglasses/mens_sunglasses_01.png" },
  { label: "Women's Polarized Sunglasses", url: "/images/products/womens-sunglasses/womens_sunglasses_01.png" },
  { label: "Sports Wrap Sunglasses", url: "/images/products/sports-sunglasses/sports_sunglasses_01.png" },
  { label: "Vintage Aviator Gold", url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80" }
];

export default function AdminDashboardPage({ setCurrentRoute }) {
  const { 
    orders, 
    updateOrderStatus, 
    products, 
    updateProduct, 
    addProduct, 
    deleteProduct,
    showToast 
  } = useShop();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem('lsw_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem('lsw_admin_auth', 'true');
      } catch (e) {
        console.error(e);
      }
      setIsAuthenticated(true);
      setAuthError('');
      showToast("Access Granted! Welcome Store Admin.", "success");
    } else {
      setAuthError("Incorrect password. Please try again.");
      showToast("Incorrect admin password!", "error");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('lsw_admin_auth');
    } catch (e) {
      console.error(e);
    }
    setIsAuthenticated(false);
    setPasswordInput('');
    setAuthError('');
    showToast("Logged out of Admin Portal", "info");
  };

  // Active Tab: 'orders' | 'inventory' | 'analytics'
  const [activeTab, setActiveTab] = useState('orders');

  // Search & Filter state for orders
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrderModal, setSelectedOrderModal] = useState(null);

  // Search & Filter state for products inventory
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Edit Product Modal state
  const [editingProductModal, setEditingProductModal] = useState(null);

  // New Product Modal state
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    type: 'eyeglasses',
    gender: 'unisex',
    shape: 'Rectangle',
    color: 'Classic Black',
    material: 'Handcrafted Italian Acetate',
    price: 1499,
    mrp: 2499,
    stock: 25,
    sku: '',
    description: 'High quality handcrafted eyewear frame designed for supreme comfort and optical precision.',
    img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
    cats: ['men', 'women'],
    bestSeller: false,
    frameOnlyAvailable: true,
    prescriptionAvailable: true,
    lensOptionsAvailable: true
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const pendingRxCount = orders.filter(o => o.status === 'Prescription Verification').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  // Filtered Orders
  const filteredOrders = orders.filter(order => {
    if (statusFilter !== 'all' && order.status !== statusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchName = order.customer?.name?.toLowerCase().includes(q);
      const matchPhone = order.customer?.phone?.toLowerCase().includes(q);
      const matchCity = order.customer?.city?.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  // Filtered Products for Inventory Manager
  const filteredProducts = products.filter(product => {
    if (productCategoryFilter !== 'all') {
      if (productCategoryFilter === 'custom') {
        const isCustom = product.id?.match(/\d{10,}/) || product.sku?.includes('ADM') || product.sku?.includes('DB') || product.isNew;
        if (!isCustom) return false;
      } else if (product.type !== productCategoryFilter && product.category !== productCategoryFilter) {
        return false;
      }
    }
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = product.name?.toLowerCase().includes(q);
      const matchSku = product.sku?.toLowerCase().includes(q);
      const matchShape = product.shape?.toLowerCase().includes(q);
      const matchColor = product.color?.toLowerCase().includes(q);
      const matchType = product.type?.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchShape && !matchColor && !matchType) return false;
    }
    return true;
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProductForm.name.trim()) {
      showToast("Please enter product name", "error");
      return;
    }
    addProduct(newProductForm);
    setShowAddProductModal(false);
    setNewProductForm({
      name: '',
      type: 'eyeglasses',
      gender: 'unisex',
      shape: 'Rectangle',
      color: 'Classic Black',
      material: 'Handcrafted Italian Acetate',
      price: 1499,
      mrp: 2499,
      stock: 25,
      sku: '',
      description: 'High quality handcrafted eyewear frame designed for supreme comfort and optical precision.',
      img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80',
      cats: ['men', 'women'],
      bestSeller: false,
      frameOnlyAvailable: true,
      prescriptionAvailable: true,
      lensOptionsAvailable: true
    });
  };

  const handleUpdateProductSubmit = (e) => {
    e.preventDefault();
    if (!editingProductModal) return;
    updateProduct(editingProductModal.id, editingProductModal);
    setEditingProductModal(null);
  };

  const handleDeleteProduct = (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}" from the catalog?`)) {
      deleteProduct(productId);
    }
  };

  // If not authenticated, render secure Password Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/80 shadow-2xl p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
          
          <div className="text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Protected Portal
              </span>
              <h2 className="font-display text-2xl font-bold text-slate-900 mt-2">
                Store Owner Access
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your secure password to access orders, prescription approvals and stock inventory.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => { setPasswordInput(e.target.value); setAuthError(''); }}
                  placeholder="Enter admin password..."
                  className={`w-full pl-10 pr-10 py-3 bg-slate-50 border ${authError ? 'border-rose-400 focus:ring-rose-400' : 'border-slate-200 focus:border-teal-600'} rounded-xl text-sm font-medium outline-none transition`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-500 font-semibold mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-slate-900/20 transition flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <button
              onClick={() => setCurrentRoute({ name: 'home' })}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition"
            >
              ← Return to Lens World Store
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-700">
              <LayoutDashboard className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-700">
              Store Owner Control Center
            </span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            LENS S WORLD Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Real-time management for customer orders, prescription approvals, stock inventory & invoices
          </p>
        </div>

        {/* Back to store, new product CTAs & Logout */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setCurrentRoute({ name: 'home' })}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition"
          >
            ← View Live Store
          </button>

          <button
            onClick={() => setShowAddProductModal(true)}
            className="px-3.5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add New Eyewear
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition flex items-center gap-1.5"
            title="Lock / Logout from Admin Portal"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* 2. Top Metrics KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Total Revenue */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block">
            ✓ Real-time GST Compliant Billing
          </span>
        </div>

        {/* Metric 2: Total Orders */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            {totalOrdersCount}
          </p>
          <span className="text-[11px] text-slate-500 font-semibold block">
            {orders.filter(o => o.status === 'Placed').length} New Unprocessed
          </span>
        </div>

        {/* Metric 3: Pending Prescription */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Rx Approvals</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-amber-600">
            {pendingRxCount}
          </p>
          <span className="text-[11px] text-amber-700 font-semibold block">
            Requires Doctor Verification
          </span>
        </div>

        {/* Metric 4: Delivered */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Delivered Orders</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <p className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
            {deliveredCount}
          </p>
          <span className="text-[11px] text-teal-700 font-semibold block">
            100% Customer Satisfaction
          </span>
        </div>

      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
            activeTab === 'orders' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
            activeTab === 'inventory' ? 'bg-slate-900 text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Glasses className="w-4 h-4" />
          <span>Product Inventory & Prices ({products.length})</span>
        </button>
      </div>

      {/* 4. Tab 1: Orders Management Table */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Search & Status Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by Order ID, customer, phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full bg-slate-50 text-xs text-slate-800 placeholder-slate-400 pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:border-teal-600"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
              {['all', ...ORDER_STATUSES].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    statusFilter === st ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Table Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items & Lenses</th>
                    <th className="p-4">Prescription</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Total (INR)</th>
                    <th className="p-4">Order Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No orders match your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const hasRx = order.prescriptionFile || order.prescriptionDetails || order.prescriptionMethod;

                      return (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition">
                          {/* ID & Date */}
                          <td className="p-4">
                            <span className="font-extrabold text-slate-900 text-sm block">
                              #{order.id}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="p-4">
                            <span className="font-bold text-slate-800 block">
                              {order.customer?.name || 'Customer'}
                            </span>
                            <span className="text-slate-500 block">{order.customer?.phone}</span>
                            <span className="text-slate-400 text-[11px] block">{order.customer?.city || 'India'}</span>
                          </td>

                          {/* Items & Lenses */}
                          <td className="p-4 max-w-[200px]">
                            <span className="font-bold text-slate-800 block">
                              {order.items?.[0]?.name} {order.items?.length > 1 ? `+${order.items.length - 1} more` : ''}
                            </span>
                            {order.items?.[0]?.disposalType ? (
                              <span className="text-[11px] text-teal-700 font-medium block truncate">
                                Disposal: {order.items[0].disposalType.name}
                              </span>
                            ) : order.items?.[0]?.selectedLens ? (
                              <span className="text-[11px] text-teal-700 font-medium block truncate">
                                Lens: {order.items[0].selectedLens.name}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400">Frame Only</span>
                            )}
                          </td>

                          {/* Prescription */}
                          <td className="p-4">
                            {hasRx ? (
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md font-bold text-[11px] border border-amber-200">
                                <FileText className="w-3 h-3" />
                                {order.prescriptionFile ? 'File Attached' : order.prescriptionDetails ? 'Power Entered' : 'WhatsApp Rx'}
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">Not Required</span>
                            )}
                          </td>

                          {/* Payment */}
                          <td className="p-4">
                            <span className="font-semibold text-slate-800 block">{order.paymentMethod}</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.paymentStatus || 'Pending'}
                            </span>
                          </td>

                          {/* Total */}
                          <td className="p-4">
                            <span className="font-extrabold text-sm text-slate-900">
                              ₹{order.total?.toLocaleString('en-IN')}
                            </span>
                          </td>

                          {/* Status Selector */}
                          <td className="p-4">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`p-1.5 px-2.5 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                                order.status === 'Delivered' 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                                  : order.status === 'Prescription Verification' 
                                    ? 'bg-amber-50 text-amber-800 border-amber-300'
                                    : order.status === 'Shipped' 
                                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                                      : 'bg-slate-100 text-slate-800 border-slate-300'
                              }`}
                            >
                              {ORDER_STATUSES.map(st => (
                                <option key={st} value={st}>{st}</option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedOrderModal(order)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                              title="View Full Order"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => printGSTInvoice(order)}
                              className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition"
                              title="Print GST Invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>

                            <a
                              href={getWhatsAppUrl(`Hello ${order.customer?.name || 'Customer'}, regarding your LENS S WORLD order #${order.id}...`)}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition inline-block"
                              title="WhatsApp Customer"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. Tab 2: Inventory & Product Catalog Manager */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Header & Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg sm:text-xl flex items-center gap-2">
                <Glasses className="w-5 h-5 text-teal-700" /> Live Product Catalog & Stock Manager
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Showing {filteredProducts.length} of {products.length} total products in store database.
              </p>
            </div>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-md transition"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm grid sm:grid-cols-3 gap-3">
            <div className="relative sm:col-span-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by title, SKU, shape, color..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-teal-600 focus:bg-white transition"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div>
              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-teal-600"
              >
                <option value="all">All Categories ({products.length})</option>
                <option value="custom">Admin Added / Custom</option>
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="power-specs">Power Specs</option>
                <option value="contact-lenses">Contact Lenses</option>
                <option value="reading-glasses">Reading Glasses</option>
                <option value="lenses">Lenses</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No products found</h4>
              <p className="text-xs text-slate-500">Try changing your search query or category filter, or add a new product.</p>
              <button
                onClick={() => { setProductSearch(''); setProductCategoryFilter('all'); }}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(p => {
                const isCustom = p.id?.match(/\d{10,}/) || p.sku?.includes('ADM') || p.sku?.includes('DB') || p.isNew;
                return (
                  <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition">
                    <div className="space-y-3">
                      <div className="flex gap-3.5 items-start">
                        <div className="relative shrink-0">
                          <img 
                            src={p.img || p.gallery?.[0] || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80'} 
                            alt={p.name} 
                            className="w-20 h-20 rounded-xl object-cover border bg-slate-50 shrink-0" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80";
                            }}
                          />
                          {p.bestSeller && (
                            <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow">
                              ★ Best
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="text-[10px] font-extrabold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                              {p.type || p.category || 'Eyewear'}
                            </span>
                            {isCustom && (
                              <span className="text-[10px] font-extrabold uppercase text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                Custom Added
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2" title={p.name}>
                            {p.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 mt-0.5">SKU: {p.sku || 'N/A'}</p>
                          <p className="text-[11px] text-slate-500">{p.shape || 'Standard'} · {p.color || 'Standard'}</p>
                        </div>
                      </div>

                      {/* Inline Price & Stock Quick Editor */}
                      <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-100">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Selling Price (₹)</label>
                          <input
                            type="number"
                            defaultValue={p.price}
                            onBlur={(e) => updateProduct(p.id, { price: Number(e.target.value) })}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 outline-none focus:border-teal-600 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Stock Count</label>
                          <input
                            type="number"
                            defaultValue={p.stock !== undefined ? p.stock : 20}
                            onBlur={(e) => updateProduct(p.id, { stock: Number(e.target.value) })}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 outline-none focus:border-teal-600 text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingProductModal({ ...p })}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg flex items-center gap-1 transition text-[11px]"
                          title="Edit Full Product Details"
                        >
                          <Edit3 className="w-3 h-3" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg flex items-center gap-1 transition text-[11px]"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-[11px] text-slate-400 font-medium">
                        MRP: ₹{p.mrp || Math.round((p.price || 999) * 1.6)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Order Detail Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative border">
            <button
              onClick={() => setSelectedOrderModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Order Inspection</span>
                <h3 className="font-display font-bold text-xl text-slate-900">Order #{selectedOrderModal.id}</h3>
              </div>
              <span className="text-xs font-bold bg-teal-50 text-teal-800 px-3 py-1 rounded-full">
                {selectedOrderModal.status}
              </span>
            </div>

            {/* Customer Details */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border">
              <div>
                <span className="font-bold text-slate-900 block mb-1">Customer Address:</span>
                <p>{selectedOrderModal.customer?.name}</p>
                <p>{selectedOrderModal.customer?.phone}</p>
                <p>{selectedOrderModal.customer?.email}</p>
                <p className="mt-1 text-slate-700 font-medium">
                  {selectedOrderModal.customer?.address}, {selectedOrderModal.customer?.city}, {selectedOrderModal.customer?.state} - {selectedOrderModal.customer?.pincode}
                </p>
              </div>
              <div>
                <span className="font-bold text-slate-900 block mb-1">Prescription & Notes:</span>
                <p>Prescription Mode: <strong>{selectedOrderModal.prescriptionMethod || 'Standard'}</strong></p>
                {selectedOrderModal.prescriptionFile && (
                  <p className="text-teal-700 font-semibold mt-1">
                    📎 File Attached: {selectedOrderModal.prescriptionFile.name}
                  </p>
                )}
                {selectedOrderModal.prescriptionDetails && (
                  <pre className="mt-1 bg-white p-2 rounded text-[10px] overflow-x-auto border">
                    {JSON.stringify(selectedOrderModal.prescriptionDetails, null, 2)}
                  </pre>
                )}
                {selectedOrderModal.notes && (
                  <p className="mt-2 text-slate-600 italic">"{selectedOrderModal.notes}"</p>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="font-bold text-xs uppercase text-slate-400">Ordered Items</h4>
              <div className="space-y-2">
                {selectedOrderModal.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-3 bg-white border rounded-xl">
                    <div className="flex items-center gap-3">
                      <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-slate-900">{item.name} (x{item.qty})</p>
                        <p className="text-slate-500">Color: {item.selectedColor} {item.selectedLens ? `| Lens: ${item.selectedLens.name}` : ''}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">
                      ₹{((item.price + (item.selectedLens?.price || 0)) * item.qty).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t flex justify-end gap-3">
              <button
                onClick={() => printGSTInvoice(selectedOrderModal)}
                className="px-5 py-2.5 bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print GST Tax Invoice
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 7. Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative border my-8">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Catalog Publisher
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mt-2">
                Add New Eyewear Product
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fill in details to immediately publish this item across all customer pages and search.
              </p>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              {/* Product Title */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LENS S WORLD Titanium Rimless Classic"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600 focus:bg-white"
                />
              </div>

              {/* Category & Gender */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category / Type</label>
                  <select
                    value={newProductForm.type}
                    onChange={(e) => setNewProductForm({ ...newProductForm, type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  >
                    <option value="eyeglasses">Eyeglasses</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="power-specs">Power Specs</option>
                    <option value="contact-lenses">Contact Lens</option>
                    <option value="reading-glasses">Reading Glasses</option>
                    <option value="lenses">Lenses</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender / Audience</label>
                  <select
                    value={newProductForm.gender}
                    onChange={(e) => {
                      const g = e.target.value;
                      const c = g === 'men' ? ['men'] : g === 'women' ? ['women'] : g === 'kids' ? ['kids'] : g === 'couple' ? ['couple', 'men', 'women'] : ['men', 'women'];
                      setNewProductForm({ ...newProductForm, gender: g, cats: c });
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  >
                    <option value="unisex">Unisex (Men & Women)</option>
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="kids">Kids</option>
                    <option value="couple">Couple Combo</option>
                  </select>
                </div>
              </div>

              {/* Shape & Material */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frame Shape</label>
                  <select
                    value={newProductForm.shape}
                    onChange={(e) => setNewProductForm({ ...newProductForm, shape: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  >
                    <option value="Rectangle">Rectangle</option>
                    <option value="Round">Round</option>
                    <option value="Aviator">Aviator</option>
                    <option value="Cat-Eye">Cat-Eye</option>
                    <option value="Wayfarer">Wayfarer</option>
                    <option value="Clubmaster">Clubmaster</option>
                    <option value="Square">Square</option>
                    <option value="Geometric">Geometric</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Color / Finish</label>
                  <input
                    type="text"
                    placeholder="e.g. Vintage Gold / Tortoise"
                    value={newProductForm.color}
                    onChange={(e) => setNewProductForm({ ...newProductForm, color: e.target.value, colors: [e.target.value] })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Price, MRP, Stock */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ 
                      ...newProductForm, 
                      price: Number(e.target.value),
                      mrp: newProductForm.mrp || Math.round(Number(e.target.value) * 1.6)
                    })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-teal-600 text-teal-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={newProductForm.mrp}
                    onChange={(e) => setNewProductForm({ ...newProductForm, mrp: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600 text-slate-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Material & SKU */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frame Material</label>
                  <input
                    type="text"
                    value={newProductForm.material}
                    onChange={(e) => setNewProductForm({ ...newProductForm, material: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custom SKU (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. LSW-SPEC-901"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Image URL & Preset Selection with Live Preview */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Product Image URL *</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    placeholder="Enter image URL or choose preset below"
                    value={newProductForm.img}
                    onChange={(e) => setNewProductForm({ ...newProductForm, img: e.target.value })}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                  <div className="w-12 h-12 rounded-xl border bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    <img 
                      src={newProductForm.img} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Presets:</span>
                  {SAMPLE_IMAGE_PRESETS.slice(0, 4).map((pr, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewProductForm({ ...newProductForm, img: pr.url })}
                      className="text-[10px] bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 px-2 py-1 rounded-md border border-slate-200 transition"
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                />
              </div>

              {/* Flags */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductForm.bestSeller}
                    onChange={(e) => setNewProductForm({ ...newProductForm, bestSeller: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className="font-bold text-slate-700 text-xs">Mark as Bestseller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductForm.lensOptionsAvailable}
                    onChange={(e) => setNewProductForm({ ...newProductForm, lensOptionsAvailable: e.target.checked })}
                    className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                  />
                  <span className="font-bold text-slate-700 text-xs">Allow Lens Customization</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Publish Product Now
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 8. Edit Product Modal */}
      {editingProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-5 relative border my-8">
            <button
              onClick={() => setEditingProductModal(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Live Editor
              </span>
              <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mt-2">
                Edit Product Details
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Editing: <span className="font-bold text-slate-700">{editingProductModal.name}</span>
              </p>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProductModal.name || ''}
                  onChange={(e) => setEditingProductModal({ ...editingProductModal, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category / Type</label>
                  <select
                    value={editingProductModal.type || editingProductModal.category || 'eyeglasses'}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, type: e.target.value, category: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  >
                    <option value="eyeglasses">Eyeglasses</option>
                    <option value="sunglasses">Sunglasses</option>
                    <option value="power-specs">Power Specs</option>
                    <option value="contact-lenses">Contact Lens</option>
                    <option value="reading-glasses">Reading Glasses</option>
                    <option value="lenses">Lenses</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Frame Shape</label>
                  <input
                    type="text"
                    value={editingProductModal.shape || ''}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, shape: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProductModal.price || 0}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:border-teal-600 text-teal-800"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">MRP Price (₹)</label>
                  <input
                    type="number"
                    value={editingProductModal.mrp || 0}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, mrp: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600 text-slate-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editingProductModal.stock !== undefined ? editingProductModal.stock : 20}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, stock: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">Product Image URL *</label>
                <div className="flex gap-3 items-center">
                  <input
                    type="text"
                    required
                    value={editingProductModal.img || ''}
                    onChange={(e) => setEditingProductModal({ ...editingProductModal, img: e.target.value })}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                  />
                  <div className="w-12 h-12 rounded-xl border bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                    <img 
                      src={editingProductModal.img} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProductModal.description || ''}
                  onChange={(e) => setEditingProductModal({ ...editingProductModal, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium outline-none focus:border-teal-600"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProductModal(null)}
                  className="px-4 py-2.5 border rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
