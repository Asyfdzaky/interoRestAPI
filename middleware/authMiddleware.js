const jwt = require("jsonwebtoken");

exports.authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Akses ditolak" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token tidak valid" });
  }
};
