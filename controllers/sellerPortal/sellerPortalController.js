const { ProductModel, SellerModel } = require('../../models');
const { Op } = require('sequelize');
const { SubcategoryModel, CategoryModel, SubsubcategoryModel, LeadModel } = require('../../models');


// Read Seller by ID
exports.getSellerById = async (req, res) => {
    try {
        console.log(req.query, 'req.params.id');
        const seller = await SellerModel.findById(req.query.id);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        res.json(seller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};