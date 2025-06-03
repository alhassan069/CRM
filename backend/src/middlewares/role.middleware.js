/**
 * Middleware to check if the user has admin role
 */
exports.isAdmin = (req, res, next) => {
  // Check if user role is available in the request
  // This should be set by the auth middleware
  if (!req.userRole) {
    return res.status(403).json({
      message: 'No role information available'
    });
  }
  
  // Check if user is an admin
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      message: 'Requires admin role'
    });
  }
  
  // User is admin, proceed to the next middleware
  next();
}; 