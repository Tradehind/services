
const { UserModel } = require('../../models');
const User = UserModel;
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your-secret-key';
const { Op } = require('sequelize');
// CRUD APIs


exports.createUser = async (req, res) => {
  try {
    if (!req?.body?.phone) {
      return res.status(500).json({ error: "Phone field is required!" });
    }

    const findUser = await User.findOne({ phone: req.body.phone });

    if (findUser) {
      return res.status(500).json({ error: "User already exists with this mobile number!" });
    }

    req.body.is_active = true;

    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const { page = 1, pageSize = 100 } = req.query;
  try {
    const offset = (page - 1) * pageSize;
    const limit = pageSize;
    const users = await User.find().skip(offset).limit(limit);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.searchFromUserList = async (req, res) => {
  try {
    let payload = req.body;
    let records;
    if (payload?.keyword) {
      let keyword = payload.keyword;
      records = await User.find({
        $or: [
          { first_name: { $regex: new RegExp(keyword, "i") } },
          { last_name: { $regex: new RegExp(keyword, "i") } },
          { email: { $regex: new RegExp(keyword, "i") } },
          { phone: { $regex: new RegExp(keyword, "i") } },
          { city: { $regex: new RegExp(keyword, "i") } },
          { state: { $regex: new RegExp(keyword, "i") } }
        ]
      });
    }
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
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
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deactivateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userStatus = !user.is_active;
    await User.findByIdAndUpdate(req.params.id, { is_active: userStatus });
    res.json({ message: 'User updated successfully', data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    if (!req.body || !req.body.phone) {
      return res.status(401).json({ message: 'missing required parameters' });
    }

    let user = await User.findOne({ phone: req.body.phone });

    if (!user) {
      user = await User.create({ phone: req.body.phone, is_active: true });
    }

    let token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '100h' });

    res.status(200).json({ token: token, data: user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.shareLoginOTP = async (req, res) => {
  try {
    let otp = Math.floor(1000 + Math.random() * 9000);
    //call sms api
    res.status(200).json({ otp: otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
