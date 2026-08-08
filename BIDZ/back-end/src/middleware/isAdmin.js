/**
 * Admin Authorization Middleware
 * Verifies that the currently authenticated user has the 'admin' role.
 * Must be used after authMiddleware to ensure `req.user` is populated.
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Admin access required." });
  }
};

export default isAdmin;
