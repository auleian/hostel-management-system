import User from "../models/User.js";
import { logger } from "./logger.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: "Authentication required" });
    }
    const user = await User.findById(userId).select("userType");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }
    if (user.userType !== "admin") {
      return res.status(403).json({ msg: "Admin privileges required" });
    }
    next();
  } catch (err) {
    logger.error("[requireAdmin] error:", err?.message || err);
    res.status(500).json({ msg: "Server error" });
  }
};
