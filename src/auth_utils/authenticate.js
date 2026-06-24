const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.access_token;
        const refreshToken = req.cookies.refresh_token;
        console.log("REFRESH TOKEN");
        console.log(refreshToken);

        if (!token)
            return res.status(401).json({ message: 'No token provided' });

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.error('JWT verification error:', err.message);
                return res.status(403).json({ message: 'Invalid token' });
            }

            req.user = user;
            console.log('AUTHENTICATION SUCCESSFUL');
            next();
        });

    } catch (err) {
        console.error('Authentication middleware error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authenticate;