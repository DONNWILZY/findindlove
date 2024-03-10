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
//Settings
const settingsRoute = require('../routes/adminSettingsRoute');
//payment Route
const paymentRoute = require('../routes/paymentRoute');
//user Route
const userRoute = require('../routes/userRoute');
//poll Route
const pollRoute = require('../routes/voteRoute');
// upload
const uploadRoute = require('../routes/uploadRoute');

function initializeRoutes(app) {

  // Use authRoute middleware
  app.use('/api/auth', authRoute);
  // Use seasonRote 
  app.use('/api/season', seasonRoute);
  // Use permissionRoute
  app.use('/api/permission', permissionRoute);
  //use form route
  app.use('/api/form', formRoute);
  //use blog route
  app.use('/api/blog', blogRoute);
  // settimgs route
  app.use('/api/settings', settingsRoute);
  // payment route
  app.use('/api/payment', paymentRoute);
  // user route
  app.use('/api/user', userRoute);
  // user route
  app.use('/api/poll', pollRoute);
    // upload route
    app.use('/api/upload', uploadRoute);



}

module.exports = initializeRoutes;


