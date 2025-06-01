const cloudinary = require('../config/cloudinary.config');

// Placeholder for server-side upload validation if needed
module.exports = (req, res, next) => {
  // Client handles uploads; this can validate Cloudinary URLs
  if (req.body.files) {
    req.body.files = req.body.files.filter((url) =>
      url.startsWith(`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}`)
    );
  }
  next();
};