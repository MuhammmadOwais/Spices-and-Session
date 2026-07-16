module.exports = {
  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.isAdmin) {
      return next();
    }
    // Set a flash or query message indicating session expired
    res.redirect('/admin/login?msg=Please log in to access the admin panel');
  }
};
