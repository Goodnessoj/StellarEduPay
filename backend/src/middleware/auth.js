'use strict';

const jwt = require('jsonwebtoken');

/**
 * requireAdminAuth — JWT-based authentication middleware for admin endpoints.
 *
 * Expects: Authorization: Bearer <token>
 *
 * The token must be signed with JWT_SECRET and carry { role: 'admin' }.
 *
 * On success: attaches req.admin (decoded payload) and calls next().
 * On failure: 401 (missing/invalid token) or 403 (insufficient role).
 */
function requireAdminAuth(req, res, next) {
  // Accept token from HttpOnly cookie (preferred) or Authorization header (fallback)
  const cookieToken = req.cookies && req.cookies.admin_token;
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required. Provide a Bearer token.',
      code: 'MISSING_AUTH_TOKEN',
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      // Fail closed — if the secret is not configured, deny all access.
      return res.status(500).json({
        error: 'Server misconfiguration: JWT_SECRET is not set.',
        code: 'AUTH_MISCONFIGURED',
      });
    }

    const decoded = jwt.verify(token, secret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        error: 'Forbidden. Admin role required.',
        code: 'INSUFFICIENT_ROLE',
      });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token has expired.',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      error: 'Invalid token.',
      code: 'INVALID_AUTH_TOKEN',
    });
  }
}

module.exports = { requireAdminAuth };
