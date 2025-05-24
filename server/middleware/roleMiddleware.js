// middleware/roleMiddleware.js
import jwt from 'jsonwebtoken';

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Add user info to request object

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the right role' });
      }
      next(); // Proceed to the next middleware
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};
