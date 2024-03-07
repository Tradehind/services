const { ProductModel, SellerModel } = require('../../models');
const Product = ProductModel;
const { Op } = require('sequelize');
const { SubcategoryModel, CategoryModel, SubsubcategoryModel } = require('../../models');


// Create a new product
exports.createProduct = async (req, res) => {
    try {
      let payload = req.body;
  
      if (payload?.name) {
        payload.name = payload.name.toLowerCase();
      }
  
      payload.is_active = true;
  
      const existingProduct = await Product.findOne({
        name: payload.name,
        seller_id: payload.seller_id
      });
  
      if (existingProduct) {
        return res.status(201).json({ error: 'Product with this name already exists.' });
      }
  
      const product = await Product.create(payload);
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getAllProducts = async (req, res) => {
    try {
      const { page = 1, pageSize = 100 } = req.query;
      const offset = (page - 1) * pageSize;
      const limit = parseInt(pageSize);
  
      const products = await Product.find()
        .skip(offset)
        .limit(limit)
        .populate('seller_id', 'company_name first_name last_name id')
        .populate('category_id', 'name id')
        .populate('sub_category_id', 'name id')
        .populate('sub_sub_category_id', 'name id')
        
        .exec();
  
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getSellerProducts = async (req, res) => {
    try {
      const params = req.params.id;
      const products = await Product.find({ seller_id: params, is_active: true });
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id).exec();
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.updateProductById = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true }).exec();
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ status: 200, message: 'Product updated!' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.deleteProductById = async (req, res) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id).exec();
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.markInactiveProductById = async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { is_active: false }, { new: true }).exec();
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json({ message: 'Product marked inactive successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.searchFromProductList = async (req, res) => {
    try {
      let keyword = req.body.keyword;
      const records = await Product.find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { price: { $regex: keyword, $options: 'i' } }
        ]
      }).exec();
      res.json(records);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.markActiveInActiveProductById = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId).exec();
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Toggle the 'active' status
      const updatedProduct = await product.updateOne({ is_active: !product.is_active }).exec();
  
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };