import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, COUPONS } from '../data/productsData';
import { supabase } from '../utils/supabaseClient';

const ShopContext = createContext();

const INITIAL_MOCK_ORDERS = [
  {
    id: "LSW-9281",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: "Prescription Verification",
    customer: {
      name: "Aman Sharma",
      phone: "+91 98201 44589",
      email: "aman.sharma@example.com",
      address: "Flat 402, Sunshine Residency, Andheri West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400053"
    },
    items: [
      {
        id: "lens-s-world-orbit-round-metal",
        name: "LENS S WORLD Orbit Round Metal",
        price: 1899,
        qty: 1,
        selectedColor: "Vintage Gold / Tortoise",
        selectedLens: {
          id: "blue-cut-screen",
          name: "Blue Cut Digital EyeShield™",
          price: 999
        },
        sku: "LSW-EYE-002",
        img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 2898,
    discount: 200,
    couponApplied: "FLAT200",
    shipping: 0,
    gst: 323,
    total: 3021,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    prescriptionMethod: "upload",
    prescriptionFile: { name: "Rx_Dr_Kapoor_Aman.pdf", size: "1.2 MB" },
    prescriptionDetails: { odSphere: "-1.75", osSphere: "-2.00", odCyl: "-0.50", osCyl: "0.00" },
    notes: "Please pack with extra anti-scratch cloth."
  },
  {
    id: "LSW-8954",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: "Shipped",
    customer: {
      name: "Pooja Verma",
      phone: "+91 97112 39012",
      email: "pooja.v@example.com",
      address: "House 12, Sector 15, Huda Complex",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122001"
    },
    items: [
      {
        id: "lens-s-world-solaro-aviator",
        name: "LENS S WORLD Solaro Aviator",
        price: 2299,
        qty: 1,
        selectedColor: "Gold & Dark Green Polarized",
        selectedLens: null,
        sku: "LSW-SUN-001",
        img: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: "lens-s-world-lens-cleaner-kit",
        name: "LENS S WORLD Lens Cleaner Kit",
        price: 199,
        qty: 1,
        sku: "LSW-ACC-001",
        img: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 2498,
    discount: 249,
    couponApplied: "LENS10",
    shipping: 0,
    gst: 270,
    total: 2519,
    paymentMethod: "Cash on Delivery",
    paymentStatus: "Pending",
    prescriptionMethod: null,
    notes: "Call before delivering."
  },
  {
    id: "LSW-8510",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: "Delivered",
    customer: {
      name: "Rahul Deshmukh",
      phone: "+91 88880 12345",
      email: "rahul.d@example.com",
      address: "B-201, Shanti Park, Kothrud",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411038"
    },
    items: [
      {
        id: "lens-s-world-clarity-reader",
        name: "LENS S WORLD Clarity Reader",
        price: 799,
        qty: 2,
        readingPower: "+2.00",
        sku: "LSW-READ-001",
        img: "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=800&q=80"
      }
    ],
    subtotal: 1598,
    discount: 0,
    couponApplied: null,
    shipping: 0,
    gst: 191,
    total: 1789,
    paymentMethod: "Credit Card",
    paymentStatus: "Paid",
    prescriptionMethod: null,
    notes: ""
  }
];

export const ORDER_STATUSES = [
  "Placed",
  "Payment Confirmed",
  "Prescription Verification",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled"
];

export function ShopProvider({ children }) {
  // Products state (synchronized with PRODUCTS_DATA, custom added products and admin edits)
  const [products, setProducts] = useState(() => {
    try {
      const deletedIds = new Set(JSON.parse(localStorage.getItem("lsw_deleted_products") || "[]"));
      const saved = localStorage.getItem("lsw_products");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const baseProductIds = new Set(PRODUCTS_DATA.map(p => p.id));
          // Custom products added by admin
          const customProducts = parsed.filter(p => p && p.id && !baseProductIds.has(p.id) && !deletedIds.has(p.id));
          // Merge base products with any edits in localStorage
          const mergedBase = PRODUCTS_DATA.filter(p => !deletedIds.has(p.id)).map(baseProd => {
            const match = parsed.find(p => p && p.id === baseProd.id);
            return match ? { ...baseProd, ...match } : baseProd;
          });
          return [...customProducts, ...mergedBase];
        }
      }
      return PRODUCTS_DATA.filter(p => !deletedIds.has(p.id));
    } catch {
      return PRODUCTS_DATA;
    }
  });

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("lsw_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("lsw_wishlist");
      return saved ? JSON.parse(saved) : ["lens-s-world-orbit-round-metal", "lens-s-world-solaro-aviator"];
    } catch {
      return ["lens-s-world-orbit-round-metal", "lens-s-world-solaro-aviator"];
    }
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("lsw_orders");
      return saved ? JSON.parse(saved) : INITIAL_MOCK_ORDERS;
    } catch {
      return INITIAL_MOCK_ORDERS;
    }
  });

  // Modals & Drawers
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [lensModalProduct, setLensModalProduct] = useState(null);
  
  // Coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync products to local storage
  useEffect(() => {
    try {
      localStorage.setItem("lsw_products", JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  // Sync cart to local storage
  useEffect(() => {
    try {
      localStorage.setItem("lsw_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Sync wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem("lsw_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  // Sync orders to local storage
  useEffect(() => {
    try {
      localStorage.setItem("lsw_orders", JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  // Initial Supabase Data Fetch (Orders & Products)
  useEffect(() => {
    async function loadSupabaseData() {
      if (!supabase) return;
      try {
        // Fetch Orders from Supabase
        const { data: dbOrders, error: orderErr } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (!orderErr && dbOrders && dbOrders.length > 0) {
          const formattedOrders = dbOrders.map(o => ({
            id: o.id,
            createdAt: o.created_at,
            status: o.status || 'Placed',
            customer: o.customer || {},
            items: o.items || [],
            subtotal: Number(o.subtotal) || 0,
            discount: Number(o.discount) || 0,
            couponApplied: o.coupon_applied,
            shipping: Number(o.shipping) || 0,
            gst: Number(o.gst) || 0,
            total: Number(o.total) || 0,
            paymentMethod: o.payment_method || 'COD',
            paymentStatus: o.payment_status || 'Pending',
            prescriptionMethod: o.prescription_method,
            prescriptionFile: o.prescription_file,
            prescriptionDetails: o.prescription_details,
            notes: o.notes || ''
          }));
          setOrders(formattedOrders);
        }

        // Fetch Products from Supabase
        const { data: dbProducts, error: prodErr } = await supabase
          .from('products')
          .select('*');

        if (!prodErr && dbProducts && dbProducts.length > 0) {
          const formattedProducts = dbProducts.map(p => {
            const colorsList = Array.isArray(p.colors) && p.colors.length > 0 
              ? p.colors 
              : (p.colors ? [p.colors] : ['Classic Black']);
            const imagesList = Array.isArray(p.images) && p.images.length > 0 
              ? p.images 
              : (p.img ? [p.img] : ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80']);
            const mainImg = imagesList[0] || p.img || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80';
            const catType = p.category || p.type || 'eyeglasses';
            const genderVal = p.gender || 'unisex';
            const catsList = p.cats || (genderVal === 'men' ? ['men'] : genderVal === 'women' ? ['women'] : genderVal === 'kids' ? ['kids'] : ['men', 'women']);

            return {
              id: p.id,
              name: p.name,
              type: catType,
              category: catType,
              gender: genderVal,
              cats: catsList,
              price: Number(p.price) || 999,
              mrp: p.original_price ? Number(p.original_price) : (p.mrp ? Number(p.mrp) : Math.round((Number(p.price) || 999) * 1.6)),
              originalPrice: p.original_price ? Number(p.original_price) : undefined,
              rating: Number(p.rating) || 4.8,
              reviews: p.reviews_count || p.reviews || 12,
              reviewsCount: p.reviews_count || p.reviews || 12,
              badge: p.badge,
              bestSeller: p.badge === 'Bestseller' || p.bestSeller || false,
              isNew: p.badge === 'New Arrival' || p.isNew || false,
              shape: p.frame_shape || p.shape || 'Rectangle',
              frameShape: p.frame_shape || p.shape || 'Rectangle',
              material: p.frame_material || p.material || 'Handcrafted Italian Acetate',
              frameMaterial: p.frame_material || p.material || 'Handcrafted Italian Acetate',
              size: p.frame_size || p.size || 'Medium (50-18-142)',
              frameSize: p.frame_size || p.size || 'Medium (50-18-142)',
              lensCompatible: p.lens_compatible !== false,
              frameOnlyAvailable: p.frameOnlyAvailable !== false,
              prescriptionAvailable: p.prescriptionAvailable !== false,
              lensOptionsAvailable: p.lens_compatible !== false && p.lensOptionsAvailable !== false,
              color: colorsList[0],
              colors: colorsList,
              img: mainImg,
              gallery: imagesList,
              images: imagesList,
              description: p.description || 'Premium quality handcrafted eyewear from LENS S WORLD.',
              features: Array.isArray(p.features) && p.features.length > 0 ? p.features : ["Handcrafted Ergonomic Design", "Prescription & Blue Cut Screen Compatible", "Smooth Steel Hinges", "Ultra-Lightweight Daily Comfort"],
              sku: p.sku || `LSW-DB-${Math.floor(100 + Math.random() * 900)}`,
              stock: p.stock_quantity !== undefined ? p.stock_quantity : (p.stock !== undefined ? p.stock : 20),
              stockQuantity: p.stock_quantity !== undefined ? p.stock_quantity : 20,
              inStock: p.in_stock !== false
            };
          });

          // Merge custom/DB products with base catalog
          setProducts(prev => {
            const dbIds = new Set(formattedProducts.map(p => p.id));
            const remaining = prev.filter(p => !dbIds.has(p.id));
            return [...formattedProducts, ...remaining];
          });
        }
      } catch (err) {
        console.warn("Supabase fetch notice:", err.message);
      }
    }

    loadSupabaseData();
  }, []);

  // Calculate totals
  const getItemUnitPrice = (item) => {
    if (item.disposalType) {
      return Math.round(item.price * (item.disposalType.priceMultiplier || 1.0));
    }
    return item.price + (item.selectedLens?.price || 0);
  };

  const subtotal = cart.reduce((sum, item) => {
    const itemUnitPrice = getItemUnitPrice(item);
    return sum + (itemUnitPrice * item.qty);
  }, 0);

  let discount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon]) {
    const cp = COUPONS[appliedCoupon];
    if (subtotal >= cp.minOrder) {
      if (cp.type === "percent") {
        discount = Math.round((subtotal * cp.value) / 100);
      } else if (cp.type === "flat") {
        discount = Math.min(cp.value, subtotal);
      }
    }
  }

  // Free shipping on all orders or orders above 499
  const shipping = subtotal > 499 || subtotal === 0 ? 0 : 79;
  const taxableAmount = Math.max(0, subtotal - discount);
  const gst = Math.round(taxableAmount * 0.12);
  const grandTotal = taxableAmount + gst + shipping;

  const cartCount = cart.reduce((count, item) => count + item.qty, 0);

  // Cart operations
  const addToCart = (product, options = {}) => {
    const {
      selectedColor = product.color || product.colors?.[0] || "Standard",
      selectedLens = null,
      disposalType = null,
      readingPower = null,
      prescriptionMethod = null,
      prescriptionDetails = null,
      prescriptionFile = null,
      qty = 1
    } = options;

    const cartItemId = `${product.id}-${selectedColor}-${selectedLens?.id || 'frame'}-${disposalType?.id || 'std'}-${readingPower || 'std'}`;

    setCart(prevCart => {
      const existingIdx = prevCart.findIndex(item => item.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].qty += qty;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            ...product,
            cartItemId,
            selectedColor,
            selectedLens,
            disposalType,
            readingPower,
            prescriptionMethod,
            prescriptionDetails,
            prescriptionFile,
            qty
          }
        ];
      }
    });

    showToast(`Added "${product.name}" to your cart!`, "success");
    setCartDrawerOpen(true);
  };

  const updateCartQty = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, qty: newQty } : item));
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
    showToast("Item removed from cart.", "info");
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast("Removed from Wishlist", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Saved to Wishlist ❤️", "success");
        return [...prev, productId];
      }
    });
  };

  // Coupon operations
  const applyCoupon = (code) => {
    setCouponError("");
    const cleanCode = (code || "").trim().toUpperCase();
    if (!cleanCode) return;

    if (!COUPONS[cleanCode]) {
      setCouponError("Invalid coupon code. Try 'FLAT200' or 'LENS10'");
      return;
    }

    const cp = COUPONS[cleanCode];
    if (subtotal < cp.minOrder) {
      setCouponError(`Minimum order amount of ₹${cp.minOrder} required for this coupon.`);
      return;
    }

    setAppliedCoupon(cleanCode);
    showToast(`Coupon '${cleanCode}' applied successfully! 🎉`, "success");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    showToast("Coupon removed", "info");
  };

  // Order Placement
  const placeOrder = async (orderData) => {
    const newOrderId = orderData.cfOrderId || `LSW-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      status: orderData.paymentStatus === 'Paid' ? "Payment Confirmed" : "Placed",
      items: [...cart],
      subtotal,
      discount,
      couponApplied: appliedCoupon,
      shipping,
      gst,
      total: grandTotal,
      customer: orderData.customer,
      paymentMethod: orderData.paymentMethod || "Cash on Delivery",
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === "Cash on Delivery" ? "Pending" : "Paid"),
      prescriptionMethod: orderData.prescriptionMethod || null,
      prescriptionFile: orderData.prescriptionFile || null,
      prescriptionDetails: orderData.prescriptionDetails || null,
      notes: orderData.notes || "",
      cfOrderId: orderData.cfOrderId || null,
      cfPaymentSessionId: orderData.cfPaymentSessionId || null
    };

    // Optimistic UI update
    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    // Supabase DB Sync
    if (supabase) {
      try {
        const { error } = await supabase.from('orders').insert([
          {
            id: newOrder.id,
            status: newOrder.status,
            customer: newOrder.customer,
            items: newOrder.items,
            subtotal: newOrder.subtotal,
            discount: newOrder.discount,
            coupon_applied: newOrder.couponApplied,
            shipping: newOrder.shipping,
            gst: newOrder.gst,
            total: newOrder.total,
            payment_method: newOrder.paymentMethod,
            payment_status: newOrder.paymentStatus,
            prescription_method: newOrder.prescriptionMethod,
            prescription_file: newOrder.prescriptionFile,
            prescription_details: newOrder.prescriptionDetails,
            notes: newOrder.notes
          }
        ]);
        if (error) console.warn("Supabase order insert notice:", error.message);
      } catch (err) {
        console.warn("Supabase order error:", err);
      }
    }

    return newOrder;
  };

  // Admin order status management
  const updateOrderStatus = async (orderId, newStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    showToast(`Order #${orderId} status updated to: ${newStatus}`, "success");

    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        if (error) console.warn("Supabase status update notice:", error.message);
      } catch (err) {
        console.warn("Supabase status error:", err);
      }
    }
  };

  // Admin product management
  const updateProduct = async (productId, updatedFields) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const updated = { ...p, ...updatedFields };
        if (updatedFields.price !== undefined && updatedFields.mrp === undefined && !updated.mrp) {
          updated.mrp = Math.round(Number(updatedFields.price) * 1.6);
        }
        return updated;
      }
      return p;
    }));
    showToast("Product details updated successfully!", "success");

    if (supabase) {
      try {
        const dbPayload = {};
        if (updatedFields.name !== undefined) dbPayload.name = updatedFields.name;
        if (updatedFields.price !== undefined) dbPayload.price = Number(updatedFields.price);
        if (updatedFields.mrp !== undefined) dbPayload.original_price = Number(updatedFields.mrp);
        if (updatedFields.stock !== undefined) {
          dbPayload.stock_quantity = Number(updatedFields.stock);
          dbPayload.in_stock = Number(updatedFields.stock) > 0;
        }
        if (updatedFields.type !== undefined) dbPayload.category = updatedFields.type;
        if (updatedFields.shape !== undefined) dbPayload.frame_shape = updatedFields.shape;
        if (updatedFields.material !== undefined) dbPayload.frame_material = updatedFields.material;
        if (updatedFields.img !== undefined) dbPayload.images = [updatedFields.img];
        if (updatedFields.description !== undefined) dbPayload.description = updatedFields.description;

        if (Object.keys(dbPayload).length > 0) {
          const { error } = await supabase
            .from('products')
            .update(dbPayload)
            .eq('id', productId);
          if (error) console.warn("Supabase product update notice:", error.message);
        }
      } catch (err) {
        console.warn("Supabase product error:", err);
      }
    }
  };

  const addProduct = async (newProduct) => {
    const slug = (newProduct.name || 'custom').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const colorVal = newProduct.color || 'Classic Black';
    const colorsArr = Array.isArray(newProduct.colors) && newProduct.colors.length > 0 
      ? newProduct.colors 
      : [colorVal];
    const imgVal = newProduct.img || 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80';
    const galleryArr = Array.isArray(newProduct.gallery) && newProduct.gallery.length > 0 
      ? newProduct.gallery 
      : [imgVal];
    const sellingPrice = Number(newProduct.price) || 1299;
    const mrpPrice = Number(newProduct.mrp) || Math.round(sellingPrice * 1.65);
    const prodType = newProduct.type || 'eyeglasses';
    const genderVal = newProduct.gender || 'unisex';
    
    // Compute category tags for filtering
    let catsArr = newProduct.cats;
    if (!catsArr || !Array.isArray(catsArr) || catsArr.length === 0) {
      if (genderVal === 'men') catsArr = ['men'];
      else if (genderVal === 'women') catsArr = ['women'];
      else if (genderVal === 'kids') catsArr = ['kids'];
      else if (genderVal === 'couple') catsArr = ['couple', 'men', 'women'];
      else catsArr = ['men', 'women'];
    }

    const productWithId = {
      id: `lens-s-world-${slug}-${Date.now()}`,
      name: newProduct.name || "Custom Frame",
      brand: newProduct.brand || "LENS S WORLD",
      type: prodType,
      category: prodType,
      gender: genderVal,
      cats: catsArr,
      shape: newProduct.shape || 'Rectangle',
      material: newProduct.material || 'Handcrafted Italian Acetate',
      color: colorVal,
      colors: colorsArr,
      price: sellingPrice,
      mrp: mrpPrice,
      stock: Number(newProduct.stock) || 20,
      sku: newProduct.sku || `LSW-ADM-${Math.floor(1000 + Math.random() * 9000)}`,
      rating: Number(newProduct.rating) || 4.9,
      reviews: Number(newProduct.reviews) || 14,
      isNew: true,
      bestSeller: Boolean(newProduct.bestSeller),
      size: newProduct.size || 'Medium (50-18-142)',
      weight: newProduct.weight || '16g',
      img: imgVal,
      gallery: galleryArr,
      images: galleryArr,
      description: newProduct.description || `${newProduct.name || 'Premium Eyewear'} crafted with high precision from LENS S WORLD.`,
      features: Array.isArray(newProduct.features) && newProduct.features.length > 0 
        ? newProduct.features 
        : ["Handcrafted Ergonomic Design", "Prescription & Blue Cut Screen Compatible", "Smooth 5-Barrel Hinges", "Ultra-Lightweight Daily Comfort"],
      frameOnlyAvailable: newProduct.frameOnlyAvailable !== false,
      prescriptionAvailable: newProduct.prescriptionAvailable !== false,
      lensOptionsAvailable: newProduct.lensOptionsAvailable !== false && prodType !== 'contact-lenses'
    };

    setProducts(prev => [productWithId, ...prev]);
    showToast(`Product "${productWithId.name}" added to catalog!`, "success");

    if (supabase) {
      try {
        const { error } = await supabase.from('products').insert([
          {
            id: productWithId.id,
            name: productWithId.name,
            category: productWithId.type,
            gender: productWithId.gender,
            price: productWithId.price,
            original_price: productWithId.mrp,
            rating: productWithId.rating,
            reviews_count: productWithId.reviews,
            badge: productWithId.bestSeller ? 'Bestseller' : 'New Arrival',
            frame_shape: productWithId.shape,
            frame_material: productWithId.material,
            frame_size: productWithId.size,
            lens_compatible: productWithId.lensOptionsAvailable,
            colors: productWithId.colors,
            images: productWithId.gallery,
            description: productWithId.description,
            features: productWithId.features,
            sku: productWithId.sku,
            in_stock: productWithId.stock > 0,
            stock_quantity: productWithId.stock
          }
        ]);
        if (error) console.warn("Supabase product insert notice:", error.message);
      } catch (err) {
        console.warn("Supabase product insert error:", err);
      }
    }

    return productWithId;
  };

  const deleteProduct = async (productId) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    try {
      const deleted = new Set(JSON.parse(localStorage.getItem("lsw_deleted_products") || "[]"));
      deleted.add(productId);
      localStorage.setItem("lsw_deleted_products", JSON.stringify(Array.from(deleted)));
    } catch (e) {}
    showToast("Product deleted from catalog", "info");

    if (supabase) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId);
        if (error) console.warn("Supabase product delete notice:", error.message);
      } catch (err) {
        console.warn("Supabase product delete error:", err);
      }
    }
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        cart,
        wishlist,
        orders,
        subtotal,
        discount,
        shipping,
        gst,
        grandTotal,
        cartCount,
        cartDrawerOpen,
        setCartDrawerOpen,
        quickViewProduct,
        setQuickViewProduct,
        lensModalProduct,
        setLensModalProduct,
        appliedCoupon,
        couponError,
        toast,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        placeOrder,
        updateOrderStatus,
        updateProduct,
        addProduct,
        deleteProduct,
        showToast
      }}
    >
      {children}
      {/* Global Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-2xl transition-all animate-bounce">
          <span className={`h-2.5 w-2.5 rounded-full ${toast.type === 'success' ? 'bg-emerald-400' : toast.type === 'error' ? 'bg-rose-400' : 'bg-amber-400'}`} />
          {toast.message}
        </div>
      )}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
