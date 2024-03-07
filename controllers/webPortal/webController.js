const { ProductModel, SellerModel } = require('../../models');
const { Op } = require('sequelize');
const { SubcategoryModel, CategoryModel, SubsubcategoryModel, LeadModel } = require('../../models');

const Product = ProductModel;
const Category = CategoryModel;
const Subcategory = SubcategoryModel;
const Subsubcategory = SubsubcategoryModel;


exports.searchProduct = async (req, res) => {
    try {
        let keyword = req.query.keyword;

        let query = await Product.find({
            name: { $regex: new RegExp(keyword, "i") },
        }).populate({
            path: 'seller_id',
            select: ['company_name', 'first_name', 'last_name', 'id', 'phone1', 'phone2'],
        }).select(['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image']);

        let relatedProducts = await Product.find({ is_active: true }).limit(20).select(['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image']);

        let relatedCategory = await Category.find({ is_active: true }).limit(20);

        res.json({ data: query, msg: 'Products fetched', status: 200, relatedProducts: relatedProducts, relatedCategory: relatedCategory });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

exports.searchBySubSubCategory = async (req, res) => {
    try {
        let subSubCategoryId = req.query.subSubCategoryId;

        let relatedProducts = await Product.find({ is_active: true }).limit(20).select(['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image']);
        
        let relatedCategory = await Category.find({ is_active: true }).limit(20);

        const products = await Product.find({ sub_sub_category_id: subSubCategoryId });

        if (products) {
            res.status(200).json({ data: products, msg: "products fetched", status: 200, relatedProducts: relatedProducts, relatedCategory: relatedCategory });
        } else {
            res.status(201).json({ msg: 'unable to fetch products', status: 201 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubSubCategoryBySubCategory = async (req, res) => {
    try {
        let subSubCategoryId = req.query.subSubCategoryId;

        // let relatedCategory = await Subsubcategory.findOne({ category_id: subSubCategoryId }).populate({
        //     path: 'category_id',
        //     select: ['name', '_id'],
        // });

        let relatedCategory = await Subcategory.findOne({ _id: subSubCategoryId });

        if (!relatedCategory) {
            return res.status(201).json({ msg: 'unable to fetch Subsubcategory using this id', status: 201 });
        }

        let subsubcategory = await Subsubcategory.find({ sub_category_id: subSubCategoryId });

        relatedCategory.Subsubcategories = subsubcategory;

        let mainCategory = await Category.findOne({ _id: relatedCategory.category_id }).select(['name', 'id']);

        if (relatedCategory) {
            res.status(200).json({ data: relatedCategory, mainCategory: mainCategory, Subsubcategories:subsubcategory, msg: "relatedCategory fetched", status: 200 });
        } else {
            res.status(201).json({ msg: 'unable to fetch relatedCategory', status: 201 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHomeCategories = async (req, res) => {
    try {
        const { page = 1, pageSize = 100 } = req.query;

        const offset = (page - 1) * pageSize;
        const limit = pageSize;
        const categories = await Category.find({ is_active: true })
            .select(['id', 'name', 'icon', 'image']).populate({
                path: 'subcategories',
                match: { is_active: true }, 
                populate: {
                  path: 'subsubcategories',
                  match: { is_active: true } 
                }
              }).lean().exec();

           // let data = await MyModel.find({  '_id': {    $in: ids   }});

            // .populate({
            //     path: "subCategories",
            //     // populate: { path: "subCategories" }
            //   })
            // .populate({
            //     path: 'subCategories',
            //     // match: { is_active: true },
            //     // select: ['id', 'name', 'icon', 'category_id'],
            //     // options: { limit: 6 },
            //     // populate: {
            //     //     path: 'subsubcategories',
            //     //     match: { is_active: true },
            //     //     select: ['id', 'name', 'icon', 'sub_category_id'],
            //     // },
            // });

        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSubCategoryByCategoryId = async (req, res) => {
    try {
        const categoryId = req.query.id;

        const categories = await Subcategory.find({ category_id: categoryId, is_active: true })
            .select(['id', 'name', 'icon', 'category_id'])
            .populate({
                path: 'subsubcategories',
                match: { is_active: true },
                select: ['id', 'name', 'icon', 'sub_category_id'],
            });

        const categoryData = await Category.findOne({ _id: categoryId });

        res.json({ msg: 'data fetched', status: 200, data: categories, categoryData: categoryData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createWebLead = async (req, res) => {
    try {
        let payload = req.body;
        if (!payload && !payload?.requirement_text) {
            res.status(201).json({ msg: 'missing required parameters', status: 201 });
        }

        payload.inquiry_from = 'web';
        payload.status = 'Pending';

        const lead = await Lead.create(req.body);
        if (lead) {
            res.status(200).json({ data: lead, msg: "lead added", status: 200 });
        } else {
            res.status(201).json({ msg: 'unable to submit your inquiry', status: 201 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHomeProducts = async (req, res) => {
    try {
        let Products = await Product.find({ is_active: true })
            .limit(5)
            .select(['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'primary_image']);

        if (Products && Products.length != 0) {
            res.status(200).json({ data: Products, msg: "Products fetched", status: 200 });
        } else {
            res.status(201).json({ msg: 'unable to find Products', status: 201 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        let productId = req.query.id;

        let product = await Product.findOne({ _id: productId });

        let responseData = { product: product };
        if (product.seller_id) {
            let seller = await SellerModel.findOne({ _id: product.seller_id }).select(['company_name', 'gst', 'address1', 'address2', 'phone1', 'phone2', 'category', 'first_name', 'last_name', 'about']);
            if (seller) {
                responseData.seller = seller;
            }

            let productSeller = await Product.find({ seller_id: product.seller_id });

            responseData.sellerProducts = productSeller;
        }

        let similarProducts = await Product.find({ category_id: product.category_id }).limit(5);

        responseData.similarProducts = similarProducts;

        if (product) {
            res.status(200).json({ data: responseData, msg: "Product fetched", status: 200 });
        } else {
            res.status(201).json({ msg: 'unable to find Product', status: 201 });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};