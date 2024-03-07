
const { AdminUserModel, SellerModel, UserModel, ProductModel } = require('../../models');
const AdminUser = AdminUserModel;

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key';

const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.loginAdmin = async (req, res) => {
  try {
    if (!req.body || !req.body.password || !req.body.username) {
      return res.status(401).json({ message: 'missing required parameters' });
    }

    const user = await AdminUser.findOne({ username: req.body.username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username / password' });
    }

    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (passwordMatch) {
      const token = await jwt.sign({ username: user.username, id: user._id }, JWT_SECRET, { expiresIn: '100h' });
      res.status(200).json({ user: user, token: token, message: 'Login successful' });
    } else {
      // Passwords do not match, authentication failed
      res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    let payload = req.body;

    payload.password = await bcrypt.hash(payload.password, saltRounds);

    const user = await AdminUser.create(payload);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const { page = 1, pageSize = 100 } = req.query;
  const offset = (page - 1) * pageSize;
  const limit = pageSize;

  try {
    const users = await AdminUser.find().skip(offset).limit(limit);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deactivateAdminUserById = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndUpdate(req.params.id, { is_active: req.body.is_active }, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.dashboardCounts = async (req, res) => {
  try {
    let sellers = await SellerModel.countDocuments();
    let users = await UserModel.countDocuments();
    let products = await ProductModel.countDocuments();
    let enquiry = 29; // Assuming this value is static for demonstration purposes

    let counts = {
      totalSellers: sellers,
      totalUsers: users,
      totalProducts: products,
      totalEnquiry: enquiry
    };

    res.status(200).json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};