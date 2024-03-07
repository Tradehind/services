// app.js
const express = require('express');
// const { Sequelize, DataTypes } = require('sequelize');
// const config = require('./config/config.json');


const routes = require('./routes/routes');


// Initialize Express
const app = express();
const cors = require('cors');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');
const path = require('path');

const fs = require('fs');
// const logs = require('./middleware/logger');
const mongoose = require('mongoose');



require('dotenv').config()


// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: '*' }));
app.use('/uploads', express.static('uploads'));



mongoose.connect(process.env.mongodb_cluster, {
//mongoose.connect('mongodb://localhost:27017/tradehind', {
//  useNewUrlParser: true,
 // useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB Connected');
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
});

// Create a logs directory if it doesn't exist
const logsDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Create a write stream (in append mode) for the logs
// const accessLogStream = fs.createWriteStream(path.join(logsDirectory, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));

const storageCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/category/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadCats = multer({ storage: storageCategory });

app.post('/upload-category-img', uploadCats.single('file'), (req, res) => {

  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  let filePath =  'uploads/category/' + req.file.filename;
  res.json({ filePath: filePath, msg: 'File uploaded successfully!' });
});


const storageSubCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/subcategory/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadSubCats = multer({ storage: storageSubCategory });

app.post('/upload-subcategory-img', uploadSubCats.single('file'), (req, res) => {

  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  let filePath =  'uploads/subcategory/' + req.file.filename;
  res.json({ filePath: filePath, msg: 'File uploaded successfully!' });
});


const storageProduct = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/product/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const uploadProduct = multer({ storage: storageProduct });

app.post('/upload-product-img', uploadProduct.single('file'), (req, res) => {

  if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }
  let filePath =  'uploads/product/' + req.file.filename;
  res.json({ filePath: filePath, msg: 'File uploaded successfully!' });
});

// Swagger definition
const swaggerDefinition = {
  info: {
    title: 'Node.js Express API with Swagger',
    version: '1.0.0',
    description: 'Documentation for a simple Node.js Express API with Swagger',
  },
  basePath: '/',
};

// Options for the swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/routes.js'], // Path to the API routes
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Serve Swagger documentation using Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use('/api', routes);


// const sequelize = new Sequelize({
//   dialect: 'oracle',
//   host: config.development.host,
//   port: config.development.port,
//   username: config.development.username,
//   password: config.development.password,

//   dialectOptions: {
//     connectString: config.development.connectionString,
//   },
//   define: {
//     freezeTableName: true
//   },
// });


// // Define the AccessLog model
// const AccessLogModel = sequelize.define("accesslogs", accessLogModel);

// // Create tables if they don't exist
// sequelize.sync();

// Create a write stream for morgan logs


// Use morgan middleware for logging
//app.use(logs);


// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
