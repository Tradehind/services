const { User } = require('./user');
const { AdminUser } = require('./adminuser');
const { Product } = require('./product');
const { Seller } = require('./seller');
const { Category } = require('./category');
const { Subcategory } = require('./subcategory');
const { Lead } = require('./lead');
const { Sequelize } = require("sequelize");
const config = require('../config/config.json');
const { Subsubcategory } = require('./subsubcategory');
const { Blog } = require('./blog');
const { AccessLogs } = require('./accessLog');

const sequelize = new Sequelize({
  dialect: 'oracle',
  host: config.development.host,
  port: config.development.port,
  username: config.development.username,
  password: config.development.password,

  dialectOptions: {
    connectString: config.development.connectionString,
  },
  define: {
    freezeTableName: true
  },
});

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});


//--------------------mentioning association---------------------------




const UserModel = sequelize.define("Users", User);
const AdminUserModel = sequelize.define("adminusers", AdminUser);
const ProductModel = sequelize.define("products", Product);
const SellerModel = sequelize.define("sellers", Seller);
const CategoryModel = sequelize.define("categories", Category);
const SubcategoryModel = sequelize.define("subcategories", Subcategory);
const SubsubcategoryModel = sequelize.define("Subsubcategories", Subsubcategory);
const LeadModel = sequelize.define("leads", Lead);
const BlogModel = sequelize.define("blogs", Blog);
const AccessLogsModel = sequelize.define("accesslogs", AccessLogs);

SubcategoryModel.belongsTo(CategoryModel, {
  foreignKey: 'category_id',
  targetKey: 'id',
  as: 'category',
});

CategoryModel.hasMany(SubcategoryModel, { foreignKey: 'category_id' });

SubcategoryModel.hasMany(SubsubcategoryModel, { foreignKey: 'sub_category_id' });

ProductModel.belongsTo(CategoryModel, {
  foreignKey: 'category_id',
  targetKey: 'id',
  as: 'category',
});

ProductModel.belongsTo(SubcategoryModel, {
  foreignKey: 'sub_category_id',
  targetKey: 'id',
  as: 'subcategory',
});

ProductModel.belongsTo(SellerModel, {
  foreignKey: 'seller_id',
  targetKey: 'id',
  as: 'seller',
});

// ProductModel.belongsTo(SubsubcategoryModel, {
//   foreignKey: 'sub_sub_category_id',
//   targetKey: 'id',
//   as: 'subsubcategory',
// });

//-------sub sub relations-------------

SubsubcategoryModel.belongsTo(CategoryModel, {
  foreignKey: 'category_id',
  targetKey: 'id',
  as: 'category',
});

SubsubcategoryModel.belongsTo(SubcategoryModel, {
  foreignKey: 'sub_category_id',
  targetKey: 'id',
  as: 'subcategory',
});

//------------------------------------



// Export all models
module.exports = {
  UserModel,
  AdminUserModel,
  ProductModel,
  SellerModel,
  CategoryModel,
  SubcategoryModel,
  SubsubcategoryModel,
  LeadModel,
  BlogModel,
  AccessLogsModel
  // Add other models here
};