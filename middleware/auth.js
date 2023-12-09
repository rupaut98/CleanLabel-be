// auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401);
    if (!token) {
        return res.sendStatus(401);
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.sendStatus(403);
    }
};

module.exports = authenticateToken;
