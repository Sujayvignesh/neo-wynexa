import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Order from './models/Order.js';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.warn('WARNING: MONGODB_URI is not defined in .env file!');
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Successfully connected to MongoDB Atlas');
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
};
connectDB();

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const newUser = new User({
      name,
      email,
      password // In a real app, this MUST be hashed!
    });

    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    res.status(201).json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, customerName, items, subtotal, tax, shipping, total, paymentMethod } = req.body;
    
    if (!items || !total || !customerName) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const newOrder = new Order({
      userId: userId || 'guest',
      customerName,
      items,
      subtotal,
      tax,
      shipping,
      total,
      paymentMethod,
      status: 'Processing'
    });

    await newOrder.save();

    res.status(201).json({ success: true, order: { id: newOrder._id } });
  } catch (err) {
    res.status(500).json({ error: 'Server error while placing order' });
  }
});

// GET /api/admin/dashboard
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalUsers = await User.countDocuments();

    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
    const totalOrders = orders.length;

    // Calculate top products
    const productSales = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (!productSales[item.id]) {
            productSales[item.id] = {
              id: item.id,
              name: item.name,
              image: item.image,
              sales: 0,
              revenue: 0
            };
          }
          productSales[item.id].sales += item.quantity;
          productSales[item.id].revenue += (item.price * item.quantity);
        });
      }
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 3);

    // Format recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map(order => ({
        id: `#ORD-${order._id.toString().slice(-5).toUpperCase()}`,
        customer: order.customerName,
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amount: `$${parseFloat(order.total).toFixed(2)}`,
        status: order.status
      }));

    res.json({
      stats: {
        revenue: totalRevenue,
        orders: totalOrders,
        customers: totalUsers
      },
      recentOrders,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching dashboard data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
