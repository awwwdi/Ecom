const admin = async (req, res, next) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
};

module.exports = admin; 