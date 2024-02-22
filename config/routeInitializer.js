// routeInitializer.js


// import authRoute
const authRoute = require('../routes/authRoute');

// import seasonRoute
const seasonRoute = require('../routes/seasonRoute');

function initializeRoutes(app) {

  // Use authRoute middleware
  app.use('/api/auth', authRoute);
  
  // Use seasonRote
  app.use('/api/auth', seasonRoute);
  
  
}

module.exports = initializeRoutes;
