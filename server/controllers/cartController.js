import User from '../models/User.js';
import Listing from '../models/Listing.js';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'cart.listing',
        select: 'title price images university category condition'
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter out any cart items where the listing has been deleted
    user.cart = user.cart.filter(item => item.listing != null);
    await user.save();

    res.json({
      success: true,
      cart: user.cart
    });
  } catch (err) {
    console.error('Get cart error:', err);
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
    const { listingId, quantity = 1 } = req.body;
    
    if (!listingId) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID is required'
      });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if listing belongs to the user
    if (listing.seller.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add your own listing to cart'
      });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if item already in cart
    const existingItem = user.cart.find(item => 
      item.listing && item.listing.toString() === listingId
    );
    
    if (existingItem) {
      // Update quantity
      existingItem.quantity += quantity;
    } else {
      // Add new item
      user.cart.push({
        listing: listingId,
        quantity: quantity
      });
    }
    
    await user.save();

    // Populate the cart items before sending response
    await user.populate({
      path: 'cart.listing',
      select: 'title price images university category condition'
    });
    
    res.json({
      success: true,
      message: 'Item added to cart',
      cart: user.cart
    });
  } catch (err) {
    console.error('Add to cart error:', err);
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
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const item = user.cart.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Verify listing still exists
    const listing = await Listing.findById(item.listing);
    if (!listing) {
      // Remove item from cart if listing no longer exists
      user.cart = user.cart.filter(cartItem => cartItem._id.toString() !== req.params.itemId);
      await user.save();
      return res.status(404).json({
        success: false,
        message: 'Listing no longer exists'
      });
    }
    
    item.quantity = quantity;
    await user.save();

    // Populate the cart items before sending response
    await user.populate({
      path: 'cart.listing',
      select: 'title price images university category condition'
    });
    
    res.json({
      success: true,
      message: 'Cart updated',
      cart: user.cart
    });
  } catch (err) {
    console.error('Update cart error:', err);
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
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const itemIndex = user.cart.findIndex(item => 
      item._id.toString() === req.params.itemId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    user.cart.splice(itemIndex, 1);
    await user.save();

    // Populate the cart items before sending response
    await user.populate({
      path: 'cart.listing',
      select: 'title price images university category condition'
    });
    
    res.json({
      success: true,
      message: 'Item removed from cart',
      cart: user.cart
    });
  } catch (err) {
    console.error('Remove from cart error:', err);
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
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.cart = [];
    await user.save();
    
    res.json({
      success: true,
      message: 'Cart cleared',
      cart: []
    });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: err.message
    });
  }
};