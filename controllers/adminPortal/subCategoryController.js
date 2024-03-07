const { SubcategoryModel } = require('../../models');
const { CategoryModel } = require('../../models');

const Subcategory = SubcategoryModel;

exports.createSubcategory = async (req, res) => {
    try {
        let payload = req.body;

        if (payload?.name) {
            payload.name = payload.name.toLowerCase();
        }

        payload.is_active = true;

        const subcategory = await Subcategory.create(payload);
        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllSubCategories = async (req, res) => {
    try {
        const categories = await Subcategory.find().populate('category_id', 'name id').exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveSubCategories = async (req, res) => {
    try {
        const categories = await Subcategory.find({ is_active: true }).populate('category_id', 'name id').exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubcategoryByCatId = async (req, res) => {
    try {
        const categories = await Subcategory.find({ category_id: req.params.id }).exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubcategoryById = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).exec();
        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(subcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSubcategoryById = async (req, res) => {
    try {
        let payload = req.body;
        const updatedSubcategory = await Subcategory.findByIdAndUpdate(req.params.id, payload, { new: true }).exec();
        if (!updatedSubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(updatedSubcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markActiveInActiveSubcategoryById = async (req, res) => {
    try {
        const subcategoryId = req.params.id;
        const subcategory = await Subcategory.findById(subcategoryId).exec();

        if (!subcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }

        // Toggle the 'active' status
        const updatedSubcategory = await subcategory.updateOne({ is_active: !subcategory.is_active }).exec();

        res.json(updatedSubcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSubcategoryById = async (req, res) => {
    try {
        const deletedSubcategory = await Subcategory.findByIdAndDelete(req.params.id).exec();
        if (!deletedSubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};