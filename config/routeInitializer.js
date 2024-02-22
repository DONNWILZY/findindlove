// routeInitializer.js


// import authRoute
const authRoute = require('../routes/authRoute');
// import seasonRoute
const seasonRoute = require('../routes/seasonRoute');
// import permssion route
const permissionRoute = require('../routes/PermissionRoute');

function initializeRoutes(app) {

  // Use authRoute middleware
  app.use('/api/auth', authRoute);
  // Use seasonRote
  app.use('/api/season', seasonRoute);
   // Use permissionRoute
   app.use('/api/permission', permissionRoute);
  
  
}

module.exports = initializeRoutes;
