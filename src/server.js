const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const index = require('./routes/index'); // your other routes
const loginRoute = require('./auth_routes/loginRoute'); // your login route
 const logoutRoute = require('./auth_routes/logoutRoute'); // logout route
const refreshTokenRoute = require('./auth_routes/refreshTokenRoute'); // refresh token route
const accessTokenRoute = require('./auth_routes/accessTokenRoute'); // access token route

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS configuration for your frontend at localhost:5173
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true, // allow sending cookies
// }));

const allowedOrigins = [
  'http://localhost:5173', // Local frontend for development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, etc.) or check if origin is in the allowedOrigins array
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow cookies to be sent
}));


// Mount your routes
app.use(index);
app.use(loginRoute);       //  login route
 app.use(logoutRoute);      // logout route
app.use(refreshTokenRoute);// refresh token route
app.use(accessTokenRoute);// access token route

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
