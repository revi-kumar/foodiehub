/**
 * FoodieHub - Database & Real-Time Orders Layer
 * Academic Web Development Mini Project
 * Student: A. Revanth Kumar | Roll No: 25CS003583 | CSE (Cyber Security)
 * 
 * Provides persistent database operations using browser storage and
 * real-time cross-tab synchronization via BroadcastChannel API.
 */

const DB_ORDERS_KEY = 'foodiehub_orders_db';
const CHANNEL_NAME = 'foodiehub_orders_channel';

// Initialize real-time cross-tab broadcast channel
let ordersChannel = null;
try {
  if (typeof BroadcastChannel !== 'undefined') {
    ordersChannel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment, falling back to storage events');
}

const FoodieDB = {
  /**
   * Get all orders from the database
   * @param {string|null} restaurantId - Optional filter by restaurant ID
   * @returns {Array} List of orders sorted newest first
   */
  getAllOrders: function(restaurantId = null) {
    try {
      const raw = localStorage.getItem(DB_ORDERS_KEY);
      let orders = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(orders)) orders = [];
      
      if (restaurantId && restaurantId !== 'all') {
        orders = orders.filter(o => o.restaurantId === restaurantId);
      }
      
      // Sort newest first
      return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (e) {
      console.error('Error reading orders from FoodieDB:', e);
      return [];
    }
  },

  /**
   * Get a single order by its unique Order ID
   * @param {string} orderId 
   * @returns {Object|null}
   */
  getOrderById: function(orderId) {
    if (!orderId) return null;
    const orders = this.getAllOrders();
    return orders.find(o => o.orderId.toLowerCase() === orderId.toLowerCase()) || null;
  },

  /**
   * Save a new order into the database
   * Generates a 4-digit Delivery Verification OTP and initial status
   * @param {Object} payload 
   * @returns {Object} Newly created order
   */
  createOrder: function(payload) {
    const orders = this.getAllOrders();
    
    // Generate secure 4-digit delivery verification OTP
    const deliveryOtp = String(Math.floor(1000 + Math.random() * 9000));
    const now = new Date();

    const newOrder = {
      orderId: payload.orderId || ('FH-' + Math.floor(10000 + Math.random() * 90000)),
      restaurantId: payload.restaurantId || (payload.items?.[0]?.restaurantId || 'mehfil-biryani'),
      restaurantName: payload.restaurantName || (payload.items?.[0]?.restaurantName || 'Mehfil Biryani & Kebabs'),
      customerName: payload.customerName || 'Customer',
      customerPhone: payload.customerPhone || '',
      customerAddress: payload.customerAddress || '',
      instructions: payload.instructions || 'None',
      paymentMethod: payload.paymentMethod || 'Cash on Delivery',
      items: payload.items || [],
      subtotal: payload.subtotal || 0,
      deliveryFee: payload.deliveryFee || 0,
      platformFee: payload.platformFee || 5,
      taxes: payload.taxes || 0,
      discount: payload.discount || 0,
      grandTotal: payload.grandTotal || 0,
      status: 'PLACED', // PLACED -> PREPARING -> OUT_FOR_DELIVERY -> DELIVERED -> CANCELLED
      deliveryOtp: deliveryOtp,
      createdAt: now.toISOString(),
      formattedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString([], { day: '2-digit', month: 'short' }),
      deliveryPartner: {
        name: 'Ramesh Kumar',
        phone: '+91 98480 12345',
        vehicle: 'Hero Splendor (AP 31 BD 4821)'
      },
      timeline: [
        {
          status: 'PLACED',
          title: 'Order Placed',
          description: 'Order received from customer and queued for restaurant confirmation.',
          timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    orders.unshift(newOrder);
    localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(orders));
    this.broadcastEvent({ type: 'ORDER_CREATED', order: newOrder });

    return newOrder;
  },

  /**
   * Update the status of an existing order
   * @param {string} orderId 
   * @param {string} newStatus ('PLACED'|'PREPARING'|'OUT_FOR_DELIVERY'|'DELIVERED'|'CANCELLED')
   * @param {string} note Optional note for the timeline
   * @returns {Object|null}
   */
  updateOrderStatus: function(orderId, newStatus, note = '') {
    const orders = this.getAllOrders();
    const index = orders.findIndex(o => o.orderId.toLowerCase() === orderId.toLowerCase());
    if (index === -1) return null;

    const order = orders[index];
    order.status = newStatus;
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let title = 'Status Updated';
    let desc = note;

    if (newStatus === 'PREPARING') {
      title = 'Kitchen Preparing Food';
      desc = desc || 'The restaurant has accepted your order and the chef is preparing the dishes fresh.';
    } else if (newStatus === 'OUT_FOR_DELIVERY') {
      title = 'Out for Delivery';
      desc = desc || `Food is packed! Delivery partner ${order.deliveryPartner.name} is on the way. Please keep your OTP ready.`;
    } else if (newStatus === 'DELIVERED') {
      title = 'Delivered Successfully';
      desc = desc || 'Delivery OTP verified. Order delivered to customer. Enjoy your meal!';
      order.deliveredAt = now.toISOString();
    } else if (newStatus === 'CANCELLED') {
      title = 'Order Cancelled';
      desc = desc || 'Order was rejected or cancelled by the restaurant partner.';
    }

    order.timeline.push({
      status: newStatus,
      title: title,
      description: desc,
      timestamp: timeStr
    });

    orders[index] = order;
    localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(orders));
    this.broadcastEvent({ type: 'ORDER_UPDATED', order: order });

    return order;
  },

  /**
   * Verify the customer OTP upon delivery
   * @param {string} orderId 
   * @param {string} enteredOtp 
   * @returns {Object} { success: boolean, message: string, order: Object }
   */
  verifyDeliveryOtp: function(orderId, enteredOtp) {
    const order = this.getOrderById(orderId);
    if (!order) {
      return { success: false, message: 'Order not found in database.' };
    }

    if (order.status === 'DELIVERED') {
      return { success: true, message: 'Order is already marked as delivered.', order: order };
    }

    const cleanEntered = String(enteredOtp || '').trim();
    if (cleanEntered !== order.deliveryOtp) {
      return {
        success: false,
        message: `Incorrect OTP! Expected 4-digit code. Please ask customer for the correct code.`
      };
    }

    // OTP matched! Advance status to DELIVERED
    const updated = this.updateOrderStatus(orderId, 'DELIVERED', 'Delivery OTP successfully verified on delivery partner portal.');
    return {
      success: true,
      message: 'OTP verified successfully! Order marked as Delivered.',
      order: updated
    };
  },

  /**
   * Real-time event broadcasting across open tabs
   */
  broadcastEvent: function(data) {
    if (ordersChannel) {
      try {
        ordersChannel.postMessage(data);
      } catch (e) {
        console.warn('Failed to post message to channel:', e);
      }
    }
  },

  /**
   * Subscribe to database updates
   * @param {Function} callback 
   * @returns {Function} Unsubscribe function
   */
  subscribe: function(callback) {
    const handleChannel = (event) => {
      if (event.data) callback(event.data);
    };

    const handleStorage = (event) => {
      if (event.key === DB_ORDERS_KEY) {
        callback({ type: 'STORAGE_UPDATED' });
      }
    };

    if (ordersChannel) {
      ordersChannel.addEventListener('message', handleChannel);
    }
    window.addEventListener('storage', handleStorage);

    return () => {
      if (ordersChannel) {
        ordersChannel.removeEventListener('message', handleChannel);
      }
      window.removeEventListener('storage', handleStorage);
    };
  },

  /**
   * Seed sample orders if database is currently empty
   */
  seedInitialDataIfEmpty: function() {
    const existing = this.getAllOrders();
    if (existing.length > 0) return;

    const sampleOrders = [
      {
        orderId: 'FH-42198',
        restaurantId: 'mehfil-biryani',
        restaurantName: 'Mehfil Biryani & Kebabs',
        customerName: 'Praveen Sharma',
        customerPhone: '9848123456',
        customerAddress: 'Flat 302, Green View Apts, MVP Colony, Sector 4, Visakhapatnam',
        instructions: 'Call when reaching gate',
        paymentMethod: 'Cash on Delivery',
        items: [
          { id: 'mb-101', name: 'Hyderabadi Chicken Dum Biryani', price: 299, quantity: 2, isVeg: false },
          { id: 'mb-104', name: 'Murgh Malai Kebab (6 Pcs)', price: 279, quantity: 1, isVeg: false }
        ],
        subtotal: 877,
        deliveryFee: 0,
        platformFee: 5,
        taxes: 44,
        discount: 50,
        grandTotal: 876,
        status: 'PREPARING',
        deliveryOtp: '7412',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        formattedTime: '15 mins ago',
        deliveryPartner: {
          name: 'Ramesh Kumar',
          phone: '+91 98480 12345',
          vehicle: 'Hero Splendor (AP 31 BD 4821)'
        },
        timeline: [
          { status: 'PLACED', title: 'Order Placed', description: 'Order submitted by customer.', timestamp: '15m ago' },
          { status: 'PREPARING', title: 'Kitchen Preparing Food', description: 'Restaurant accepted order.', timestamp: '10m ago' }
        ]
      },
      {
        orderId: 'FH-51824',
        restaurantId: 'bella-napoli',
        restaurantName: 'Bella Napoli Woodfired Pizzeria',
        customerName: 'Sneha Rao',
        customerPhone: '9989712340',
        customerAddress: 'Villa 14, Palm Beach Road, Visakhapatnam',
        instructions: 'Extra oregano and chili flakes please',
        paymentMethod: 'UPI / Google Pay (Demo)',
        items: [
          { id: 'bn-201', name: 'Margherita Basilico Pizza (11 inch)', price: 349, quantity: 1, isVeg: true },
          { id: 'bn-205', name: 'Cheesy Stuffed Garlic Bread', price: 189, quantity: 1, isVeg: true }
        ],
        subtotal: 538,
        deliveryFee: 0,
        platformFee: 5,
        taxes: 27,
        discount: 0,
        grandTotal: 570,
        status: 'OUT_FOR_DELIVERY',
        deliveryOtp: '3925',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        formattedTime: '30 mins ago',
        deliveryPartner: {
          name: 'K. Satish',
          phone: '+91 94401 56789',
          vehicle: 'Honda Activa (AP 31 EK 2910)'
        },
        timeline: [
          { status: 'PLACED', title: 'Order Placed', description: 'Order submitted by customer.', timestamp: '30m ago' },
          { status: 'PREPARING', title: 'Kitchen Preparing Food', description: 'Chefs baking woodfired pizza.', timestamp: '20m ago' },
          { status: 'OUT_FOR_DELIVERY', title: 'Out for Delivery', description: 'Rider is on the way to delivery address.', timestamp: '8m ago' }
        ]
      }
    ];

    localStorage.setItem(DB_ORDERS_KEY, JSON.stringify(sampleOrders));
  }
};

// Auto-seed initial data on load if empty
if (typeof window !== 'undefined') {
  FoodieDB.seedInitialDataIfEmpty();
}
