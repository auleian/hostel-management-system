import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return bcrypt.hash(password, 5);
};

export const comparePassword = async(password, hash) => {
  return bcrypt.compare(password, hash);
}

export const protect = (req, res, next) => {
  // Try Authorization header first then cookie
  const authHeader = req.header('Authorization') || req.headers['authorization'];
  let token;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
  else if (req.cookies && req.cookies.token) token = req.cookies.token;

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id: ... }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
