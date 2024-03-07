const express = require('express');
const router = express.Router();
const userController = require('../controllers/adminPortal/userController');
const adminController = require('../controllers/adminPortal/adminUserController');
const sellerController = require('../controllers/adminPortal/sellerController');
const authenticateJWT = require('../middleware/authentication');
const productController = require('../controllers/adminPortal/productController');
const categoryController = require('../controllers/adminPortal/categoryController');
const subCategoryController = require('../controllers/adminPortal/subCategoryController');
const subSubCategoryController = require('../controllers/adminPortal/subSubCategoryController');
const cityStateController = require('../controllers/adminPortal/cityStateController');
const leadController = require('../controllers/adminPortal/leadController');
const blogController = require('../controllers/adminPortal/blogController');
const webController = require('../controllers/webPortal/webController');
const membershipController = require('../controllers/adminPortal/membershipController');
const sellerPortalController = require('../controllers/sellerPortal/sellerPortalController');
// Apply middleware to routes that require authentication
// router.use(authenticateJWT);



// User Controller routes
router.post('/user', userController.createUser);
router.get('/user', userController.getAllUsers);
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.updateUserById);
router.get('/mark-user-active/:id', userController.deactivateUserById);
router.post('/user-login', userController.loginUser);
router.get('/share-user-otp', userController.shareLoginOTP);
router.post('/search-user', userController.searchFromUserList);


// Admin Controller Routes
router.post('/admin-user', adminController.createUser);
router.get('/admin-user', adminController.getAllUsers);
router.get('/admin-user/:id', adminController.getUserById);
router.put('/admin-user/:id', adminController.updateUserById);
router.delete('/admin-user/:id', adminController.deleteUserById);
router.post('/admin-login', adminController.loginAdmin);
router.get('/sellers', sellerController.sellerListingAdmin);
router.get('/import-sellers', sellerController.importDataSeller);
router.post('/search-sellers', sellerController.searchFromSellerList);
router.get('/dashboard-counts', adminController.dashboardCounts)
router.get('/mark-adminuser-active/:id', adminController.deactivateAdminUserById);

// Seller Controller Routes
router.post('/seller', sellerController.createSeller);
router.get('/seller/:id', sellerController.getSellerById);
router.put('/seller/:id', sellerController.updateSeller);
router.delete('/seller/:id', sellerController.deleteSeller);
router.put('/seller-status/:id', sellerController.markInactiveSellerById);

router.get('/import-service', sellerController.importNewDataSeller);


// Product controller
router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/seller-products/:id', productController.getSellerProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProductById);
router.delete('/products/:id', productController.deleteProductById);
router.get('/inactive-products/:id', productController.markInactiveProductById);
router.post('/search-product', productController.searchFromProductList);
router.put('/mark-product-status/:id', productController.markActiveInActiveProductById);



// Category controller
router.post('/categories', categoryController.createCategory);
router.get('/categories', categoryController.getAllCategories);
router.get('/active-categories', categoryController.getActiveCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.put('/categories/:id', categoryController.updateCategoryById);
router.put('/mark-categories/:id', categoryController.markActiveInActiveCategoryById);
router.delete('/categories/:id', categoryController.deleteCategoryById);
router.get('/category-bulk-import', categoryController.importDataCategory);

// Sub-Category controller
router.post('/subcategory', subCategoryController.createSubcategory);
router.get('/subcategory', subCategoryController.getAllSubCategories);
router.get('/active-subcategories', subCategoryController.getActiveSubCategories);
router.get('/subcategory/:id', subCategoryController.getSubcategoryById);
router.get('/subcategory-bycategory/:id', subCategoryController.getSubcategoryByCatId);
router.put('/subcategory/:id', subCategoryController.updateSubcategoryById);
router.put('/mark-subcategory/:id', subCategoryController.markActiveInActiveSubcategoryById);
router.delete('/subcategory/:id', subCategoryController.deleteSubcategoryById);

// Sub-Sub-Category controller
router.post('/subsubcategory', subSubCategoryController.createSubsubcategory);
router.get('/subsubcategory', subSubCategoryController.getAllSubsubCategories);
router.get('/active-subsubcategories', subSubCategoryController.getActiveSubsubCategories);
router.get('/subsubcategory/:id', subSubCategoryController.getSubsubcategoryById);
router.get('/subsubcategory-bycategory/:id', subSubCategoryController.getSubsubcategoryByCatId);
router.put('/subsubcategory/:id', subSubCategoryController.updateSubsubcategoryById);
router.put('/mark-subsubcategory/:id', subSubCategoryController.markActiveInActiveSubsubcategoryById);
router.delete('/subsubcategory/:id', subSubCategoryController.deleteSubsubcategoryById);

// City State Controller
router.get('/city-list', cityStateController.cityList);
router.get('/state-list', cityStateController.stateList);
router.get('/city-single-list', cityStateController.citySingleList);

// Lead Controller
router.post('/leads', leadController.createLead);
router.get('/leads', leadController.getAllLeads);
router.get('/leads-paginated', leadController.leadListingPaginated);
router.get('/leads/:id', leadController.getLeadById);
router.put('/leads/:id', leadController.updateLeadById);
router.delete('/leads/:id', leadController.deleteLeadById);
router.post('/lead-status', leadController.updateLeadStatus);

// Blog Controller
router.get('/all-posts', blogController.getAllPosts);
router.get('/blog/:id', blogController.getPostById);
router.post('/blog', blogController.createPost);
router.put('/blog/:id', blogController.updatePost);
router.delete('/blog/:id', blogController.deletePost);
router.get('/web-blogs', blogController.getWebBlogs);
router.put('/mark-blog-status/:id', blogController.markBlogStatus);

//Web Controller
router.get('/search-product-bykeyword', webController.searchProduct);
router.get('/home-categories', webController.getHomeCategories);
router.post('/create-web-lead', webController.createWebLead);
router.post('/home-products', webController.getHomeProducts);
router.get('/search-by-subsubcategory', webController.searchBySubSubCategory);
router.get('/subcategory-by-category', webController.getSubCategoryByCategoryId);
router.get('/subsubcategory-by-subcategory', webController.getSubSubCategoryBySubCategory);
router.get('/product-by-id', webController.getProductDetail);

//MembershipController

router.get('/membership', membershipController.getMembershipPlans);

//SellerPortal Controller



module.exports = router;

