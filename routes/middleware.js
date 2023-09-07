const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.token;
  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) res.status(403).json({ error: "Invalid Token!" });
        req.user = user;
        next();
      });
    } else {
      return res.status(401).json({ message: "User not authenticated!" });
    }
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.json({ success: false, message: "unauthorized access!" });
    }
    if (error.name === "TokenExpiredError") {
      return res.json({
        success: false,
        message: "Session expired try sign in again!",
      });
    }

    res.json({ success: false, message: "Internal server error" });
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Unauthorized Access!" });
    }
  });
};

module.exports = { verifyToken, verifyTokenAndAuthorization };
