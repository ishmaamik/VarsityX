
import User from '../models/User.js';
import Listing from '../models/Listing.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('cart.listing');
    
    res.json({
      success: true,
      cart: user.cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch cart',
      error: err.message
    });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { listingId, quantity } = req.body;
    
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    const user = await User.findById(req.user.userId);
    
    // Check if item already in cart
    const existingItem = user.cart.find(item => item.listing.toString() === listingId);
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity || 1;
    } else {
      // Add new item
      user.cart.push({
        listing: listingId,
        quantity: quantity || 1
      });
    }
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to add to cart',
      error: err.message
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const user = await User.findById(req.user.userId);
    const item = user.cart.find(item => item._id.toString() === req.params.itemId);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    item.quantity = quantity;
    await user.save();
    
    res.json({
      success: true,
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to update cart',
      error: err.message
    });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    user.cart = user.cart.filter(item => item._id.toString() !== req.params.itemId);
    await user.save();
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove from cart',
      error: err.message
    });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.userId, {
      cart: []
    });
    
    res.json({
      success: true,
      message: 'Cart cleared'
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: err.message
    });
  }
};