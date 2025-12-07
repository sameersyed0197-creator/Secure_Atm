import jwt from "jsonwebtoken";

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      userId: decoded.userId || decoded.id,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}












// import jwt from 'jsonwebtoken'

// export default function auth(req, res, next) {
//   const authHeader = req.headers.authorization
//   const token = authHeader?.startsWith('Bearer ')
//     ? authHeader.slice(7)
//     : null

//   if (!token) {
//     return res.status(401).json({ message: 'No token, authorization denied' })
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET)
//     req.user = { userId: decoded.userId, email: decoded.email }
//     next()
//   } catch (err) {
//     return res.status(401).json({ message: 'Token is not valid' })
//   }
// }
