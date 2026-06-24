// socket/socketAuthenticate.js

const cookie = require("cookie");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Reusable socket authentication middleware.
 * Verifies the JWT access token from the handshake cookies.
 */
const authenticateSocket = (socket, next) => {
    try {
        console.log("HERE GOES YOUR SOCKET");
        console.log(socket);
        const cookieString = socket.handshake.headers.cookie;
        
        if (!cookieString) {
            return next(new Error("Authentication error: No cookies provided"));
        }

        const cookies = cookie.parse(cookieString);
        const token = cookies.access_token;

        if (!token) {
            return next(new Error("Authentication error: Token missing"));
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return next(new Error("Authentication error: Token expired or invalid"));
            }

            /* Attach user object to the socket session for subsequent operations */
            socket.user = user;
            next();
        });
        
    } catch (err) {
        console.error("Socket authentication error:", err);
        next(new Error("Authentication error: Server error"));
    }
};

module.exports = authenticateSocket;