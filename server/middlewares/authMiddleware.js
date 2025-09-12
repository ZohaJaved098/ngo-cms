//need to authenticate all users
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies["access-token"];

  if (!token) {
    return res.status(401).json({ message: `No Token! Can't Authenticate!` });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    // console.log("User verified:", req.user);

    next();
  } catch (error) {
    res.status(400).json({ message: `Invalid Token!`, error });
  }
};
module.exports = verifyToken;
