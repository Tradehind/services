const { AccessLogsModel } = require('../models');



  const logs = (req, res, next) => {

    
        const logData = {
          userId: req.userId, // Assuming you have userId attached to req
          method: req.method,
          route: req.originalUrl,
        };
      
        // Log to the console
        console.log(logData);
      
        // Store the log in the database
        AccessLogsModel.create(logData)
          .then(() => next())
          .catch((error) => {
            console.error('Error saving log to database:', error);
            next();
          });
      

  }


  module.exports = logs;