// middleware/customerAuth.middleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

exports.protectCustomer = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    if (decoded.role !== "customer") throw new Error("Not a customer token");
    req.customerMobile = decoded.mobile;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};