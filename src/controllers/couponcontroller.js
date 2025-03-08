const Cart = require('../models/cartmodel');
const Coupon = require('../models/couponmodel')

// Calculate Shipping Fee
const calculateShippingFee = (cart, userLocation) => {
  // Example logic based on user location (e.g., country/zipcode)
  if (userLocation.country === 'US') {
    return 10; // $10 for US-based shipping
  }
  return 20; // $20 for international shipping
};

// Calculate Tax
const calculateTax = (cart, userLocation) => {
  // Example: Apply tax based on user's country
  const taxRate = userLocation.country === 'US' ? 0.08 : 0.2; // 8% for US, 20% for others
  const totalAmount = cart.items.reduce((total, item) => {
    const productPrice = item.productId.price;
    return total + productPrice * item.quantity;
  }, 0);

  return totalAmount * taxRate;
};

// Calculate Estimated Delivery Time
const calculateEstimatedDeliveryTime = (userLocation) => {
  // Estimated time based on user location
  return userLocation.country === 'US' ? '3-5 business days' : '7-14 business days';
};

exports.applyCoupon = async (req, res) => {
  const { code, userLocation } = req.body;  // Include userLocation for shipping and tax calculations
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(400).json({ message: 'Invalid coupon code' });
    }

    // Check if the coupon is valid
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return res.status(400).json({ message: 'Coupon expired' });
    }

    const totalAmount = cart.items.reduce((total, item) => {
      const productPrice = item.productId.price;
      return total + productPrice * item.quantity;
    }, 0);

    // Check if the total amount meets the minimum order amount for the coupon
    if (totalAmount < coupon.minOrderAmount) {
      return res.status(400).json({ message: 'Order amount too low for this coupon' });
    }

    // Apply coupon discount
    const discount = (totalAmount * coupon.discountPercentage) / 100;
    const discountedAmount = totalAmount - discount;

    // Calculate shipping fee, tax, and estimated delivery time
    const shippingFee = calculateShippingFee(cart, userLocation);
    const tax = calculateTax(cart, userLocation);
    const estimatedDeliveryTime = calculateEstimatedDeliveryTime(userLocation);

    // Calculate final price after coupon discount, shipping, and tax
    const finalPrice = discountedAmount + shippingFee + tax;

    // Return the response with all calculated values
    res.status(200).json({
      message: 'Coupon applied successfully',
      discountedAmount,
      shippingFee,
      tax,
      estimatedDeliveryTime,
      finalPrice,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
