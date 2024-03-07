const { ProductModel, SellerModel } = require('../../models');
const { Op } = require('sequelize');
const { SubcategoryModel, CategoryModel, SubsubcategoryModel, LeadModel } = require('../../models');
const { membershipPlans } = require('../../config/membership');

exports.getMembershipPlans = async (req, res) => {

    if(membershipPlans){
        res.json({ data: membershipPlans, msg: 'membership fetched', status: 200 });
    }else{
        res.json({  msg: 'membership records not found', status: 201 });

    }

}