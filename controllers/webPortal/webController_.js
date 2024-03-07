const { ProductModel, SellerModel } = require('../../models');
const { Op } = require('sequelize');
const { SubcategoryModel, CategoryModel, SubsubcategoryModel, LeadModel } = require('../../models');
const { Category } = require('../../models/category');


exports.searchProduct = async (req, res) => {

    try {
        let keyword = req.query.keyword;

        // if (keyword) {
        //     keyword = keyword.toLowerCase();
        // }

        console.log(req.query, 'req.query');
        let includeData = [
            {
                model: SellerModel,
                as: 'seller',
                attributes: ['company_name', 'first_name', 'last_name', 'id', 'phone1', 'phone2'],
            }];

        var query = await ProductModel.findAll({
            // offset: offset,
            // limit: limit,
            where: {
                // [Op.like]: [
                name: { [Op.like]: '%' + keyword + '%' },
                // description: { [Op.like]: '%' + keyword + '%' },
                // ],
            },
            include: includeData,
            attributes: ['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image'],
        });

        //temp code

        // if (query.length == 0) {
        //     query = await ProductModel.findAll({
        //         limit: 20,
        //         include:includeData,
        //         attributes: ['name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image'],
        //     });
        // }

        //-------------------fetch related products---------------------

        let relatedProducts = await ProductModel.findAll({
            limit: 20,
            include: includeData,
            where: { is_active: true },
            attributes: ['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image'],
        });



        let relatedCategory = await CategoryModel.findAll({
            limit: 20,
            // include:includeData,
            // attributes: ['name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image'],
        });

        res.json({ data: query, msg: 'Products fetched', status: 200, relatedProducts: relatedProducts, relatedCategory: relatedCategory });


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


exports.searchBySubSubCategory = async (req, res) => {
    try {

        let subSubCategoryId = req.query.subSubCategoryId;
        console.log(subSubCategoryId, 'subSubCategoryId');

        //-------------------fetch related products---------------------

        let relatedProducts = await ProductModel.findAll({
            limit: 20,
            // include: includeData,
            attributes: ['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id', 'sub_sub_category_id', 'specification', 'primary_image'],
            where: { is_active: true }
        });



        let relatedCategory = await CategoryModel.findAll({
            limit: 20,
            where: { is_active: true }
        });

        const products = await ProductModel.findAll({
            where: { sub_sub_category_id: subSubCategoryId }
        });

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
        console.log(subSubCategoryId, 'subSubCategoryId');

        let includeData = [
            {
                model: SubsubcategoryModel,
                attributes: ['name', 'id', 'image', 'icon', 'category_id', 'sub_category_id'],
                // as: 'subcategory',
                // attributes: ['company_name', 'first_name', 'last_name', 'id', 'phone1', 'phone2'],
            }];
        let relatedCategory = await SubcategoryModel.findOne({
            where: { id: subSubCategoryId },
            attributes: ['name', 'id', 'image', 'icon', 'category_id'],
            include: includeData,

        });

        console.log(relatedCategory, 'relatedCategory');

        if(!relatedCategory){
           return res.status(201).json({ msg: 'unable to fetch Subsubcategory using this id', status: 201 });
        }

        let mainCategory = await CategoryModel.findOne({
            where: { id: relatedCategory.category_id },
            attributes: ['name', 'id'],
        });


        if (relatedCategory) {
            res.status(200).json({ data: relatedCategory, mainCategory: mainCategory, msg: "relatedCategory fetched", status: 200 });
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
        const categories = await CategoryModel.findAll({
            where: { is_active: true },

            attributes: ['id', 'name', 'icon', 'image'],
            include: [
                {
                    model: SubcategoryModel,
                    where: { is_active: true },
                    attributes: ['id', 'name', 'icon', 'category_id'],
                    limit: 6,
                    include: [
                        {
                            model: SubsubcategoryModel,
                            where: { is_active: true },
                            attributes: ['id', 'name', 'icon', 'sub_category_id'],
                        },
                    ],
                },
            ],
        });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getSubCategoryByCategoryId = async (req, res) => {
    try {
        console.log('req.req.params.id', req.query.id);
        const categories = await SubcategoryModel.findAll(
            {
                where: { category_id: req.query.id, is_active: true },
                attributes: ['id', 'name', 'icon', 'category_id'],
                include: [
                    {
                        model: SubsubcategoryModel,
                        where: { is_active: true },
                        attributes: ['id', 'name', 'icon', 'sub_category_id'],
                    },
                ],
            }
        );
        const categoryData = await CategoryModel.findOne({ where: { id: req.query.id } });
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

        const lead = await LeadModel.create(req.body);
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

        let Products = await ProductModel.findAll({
            limit: 5,
            // include: includeData,
            attributes: ['id', 'name', 'price', 'seller_id', 'category_id', 'sub_category_id',
                'sub_sub_category_id', 'primary_image'],
            is_active: true
        });

        if (Products && Products.length != 0) {
            res.status(200).json({ data: Products, msg: "Products fetched", status: 200 });
        } else {
            res.status(201).json({ msg: 'unable to find Products', status: 201 });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


exports.getProductDetail = async (req, res) => {

    try {

        let productId = req.query.id;

        let product = await ProductModel.findOne({
            where: { id: productId }
        });

        let responseData = {}
        responseData.product = product;
        if (product.seller_id) {

            let seller = await SellerModel.findOne({
                where: { id: product.seller_id },
                attributes: ['company_name', 'gst', 'address1', 'address2', 'phone1', 'phone2', 'category', 'first_name', 'last_name', 'about']
            });
            if(seller){
                responseData.seller = seller;
            }

            //----------get seller products--------

            let productSeller = await ProductModel.findAll({
                //where: { seller_id: product.seller_id }
            });

            responseData.sellerProducts = productSeller;


        }

        //-----similar products----------

        let similarProducts = await ProductModel.findAll({
            // where: { id: productId }
        });

        responseData.similarProducts=similarProducts;

        if (product) {
            res.status(200).json({ data: responseData, msg: "Product fetched", status: 200 });
        } else {
            res.status(201).json({ msg: 'unable to find Product', status: 201 });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}