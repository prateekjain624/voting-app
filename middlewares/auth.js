import jwt from "jsonwebtoken";

const authorization = (req, res, next) => {
  // first check request headers has authorization or not
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(401).json({ error: "Token Not Found" });

  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid token" });
  }
};

export default authorization;
