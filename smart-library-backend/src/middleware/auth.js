const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responses');

const protect = async (req, res, next) => {
    try {
        let token;

        if(req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            return errorResponse(res, 'Not authorized to access this route', 401);
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = await User.findOne(decoded.id);

        if(!req.user) {
            return errorResponse(res, 'User Not Found', 404);
        }
        next();

    } catch(error) {
        return errorResponse(res, 'Not authorized to access this route',401);
    }
};

module.exports = { protect };