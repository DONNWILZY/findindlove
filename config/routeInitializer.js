// routeInitializer.js


// import authRoute
const authRoute = require('../routes/authRoute');
// import seasonRoute
const seasonRoute = require('../routes/seasonRoute');
// import permssion route
const permissionRoute = require('../routes/PermissionRoute');
//import form routes
const formRoute = require('../routes/formRoute');
// Blog route for new, video content
const blogRoute = require('../routes/blogRoutes');

function initializeRoutes(app) {

  // Use authRoute middleware
  app.use('/api/auth', authRoute);
  // Use seasonRote 
  app.use('/api/season', seasonRoute);
   // Use permissionRoute
   app.use('/api/permission', permissionRoute);
   //use form route
   app.use('/api/blog', blogRoute);

  
  
}

module.exports = initializeRoutes;
