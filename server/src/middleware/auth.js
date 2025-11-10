import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // Try Authorization header first then cookie
  const authHeader = req.header('Authorization') || req.headers['authorization'];
  let token;
  console.log(`[protect] incoming request: ${req.method} ${req.path}`);
  console.log(`[protect] Authorization header present: ${!!authHeader}`);
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
  else if (req.cookies && req.cookies.token) token = req.cookies.token;

  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Use same fallback secret as controller so local dev tokens verify when JWT_SECRET is not set
    const secret = process.env.JWT_SECRET || 'dev_jwt_secret';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // decoded = { id: ... }
    next();
  } catch (err) {
    console.error('[protect] jwt.verify error:', err && err.message ? err.message : err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
