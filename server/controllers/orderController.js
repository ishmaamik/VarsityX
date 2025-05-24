
import Order from '../models/Order.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';

// Create an order from cart
export const createOrder = async (req, res) => {
  try {
    const { paymentMethod, deliveryMethod } = req.body;
    const userId = req.user.userId;
    
    const user = await User.findById(userId).populate('cart.listing');
    
    if (user.cart.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Calculate total amount
    const totalAmount = user.cart.reduce((total, item) => {
      return total + (item.listing.price * item.quantity);
    }, 0);
    
    // Create order items
    const orderItems = user.cart.map(item => ({
      listing: item.listing._id,
      quantity: item.quantity,
      price: item.listing.price
    }));
    
    // Get unique sellers from cart items
    const sellers = [...new Set(user.cart.map(item => item.listing.seller))];
    
    // Create an order for each seller (or combine into one order)
    const orders = await Promise.all(sellers.map(async sellerId => {
      const sellerItems = user.cart.filter(item => 
        item.listing.seller.toString() === sellerId.toString()
      );
      
      const sellerAmount = sellerItems.reduce((total, item) => {
        return total + (item.listing.price * item.quantity);
      }, 0);
      
      const sellerOrderItems = sellerItems.map(item => ({
        listing: item.listing._id,
        quantity: item.quantity,
        price: item.listing.price
      }));
      
      return Order.create({
        buyer: userId,
        seller: sellerId,
        items: sellerOrderItems,
        totalAmount: sellerAmount,
        paymentMethod,
        deliveryMethod
      });
    }));
    
    // Clear user's cart
    user.cart = [];
    await user.save();
    
    // Update listings status (optional)
    await Listing.updateMany(
      { _id: { $in: user.cart.map(item => item.listing._id) } },
      { status: 'sold' }
    );
    
    res.status(201).json({
      success: true,
      orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: err.message
    });
  }
};

// Get user's orders
export const getOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { role } = req.user;
    
    let query = {};
    if (role === 'User') {
      query.buyer = userId;
    } else {
      query.seller = userId;
    }
    
    const orders = await Order.find(query)
      .populate('buyer', 'displayName email')
      .populate('seller', 'displayName email')
      .populate('items.listing', 'title price');
    
    res.json({
      success: true,
      orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: err.message
    });
  }
};

// Get order details
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'displayName email university')
      .populate('seller', 'displayName email university')
      .populate('items.listing', 'title price category images');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if user is buyer or seller
    if (order.buyer._id.toString() !== req.user.userId && 
        order.seller._id.toString() !== req.user.userId &&
        req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }
    
    res.json({
      success: true,
      order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: err.message
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Only seller or admin can update status
    if (order.seller.toString() !== req.user.userId && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }
    
    order.status = status;
    await order.save();
    
    res.json({
      success: true,
      order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: err.message
    });
  }
};