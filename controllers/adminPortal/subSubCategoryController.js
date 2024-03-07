const { SubsubcategoryModel, SubcategoryModel } = require('../../models');
const { CategoryModel } = require('../../models');
const Subsubcategory = SubsubcategoryModel;

exports.createSubsubcategory = async (req, res) => {
    try {
        let payload = req.body;

        if (payload?.name) {
            payload.name = payload.name.toLowerCase();
        }

        payload.is_active = true;

        const subsubcategory = await Subsubcategory.create(payload);
        res.json(subsubcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllSubsubCategories = async (req, res) => {
    try {
        const categories = await Subsubcategory.find()
            .populate('category_id', 'name id')
            .populate('sub_category_id', 'name id')
            .exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getActiveSubsubCategories = async (req, res) => {
    try {
        const categories = await Subsubcategory.find({ is_active: true })
            .populate('category_id', 'name id')
            .populate('sub_category_id', 'name id')
            .exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubsubcategoryByCatId = async (req, res) => {
    try {
        console.log('req.req.params.id', req.params.id);
        const categories = await Subsubcategory.find({ sub_category_id: req.params.id }).exec();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubsubcategoryById = async (req, res) => {
    try {
        const subsubcategory = await Subsubcategory.findById(req.params.id).exec();
        if (!subsubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(subsubcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSubsubcategoryById = async (req, res) => {
    try {
        let payload = req.body;
        console.log(payload);
        const updatedSubsubcategory = await Subsubcategory.findByIdAndUpdate(req.params.id, payload, { new: true }).exec();
        if (!updatedSubsubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json(updatedSubsubcategory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.markActiveInActiveSubsubcategoryById = async (req, res) => {
    try {
        const subcategoryId = req.params.id;
        const subcategory = await Subsubcategory.findById(subcategoryId).exec();

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

exports.deleteSubsubcategoryById = async (req, res) => {
    try {
        const deletedSubcategory = await Subsubcategory.findByIdAndDelete(req.params.id).exec();
        if (!deletedSubcategory) {
            return res.status(404).json({ message: 'Subcategory not found' });
        }
        res.json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};