const jwt = require('jsonwebtoken');
const User = require('../models/User');
const i18next = require('i18next');

exports.isAuthenticated = async(req,res,next) =>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(403).json({ message: i18next.t('authRequired') });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).json({ message: i18next.t('authInvalid') });
    }
};

exports.isAuthorized = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ message: i18next.t('authForbidden') });
    }
    next();
};

