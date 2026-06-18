// routes/loginRoute.js
const express = require('express');
const admin = require('../firebase-admin'); // Adjust path as necessary
const { generateAccessToken, generateRefreshToken } = require('../jwt/jwtUtils');
const ACCESS_COOKIE_EXPIRY = process.env.ACCESS_COOKIE_EXPIRY;
const REFRESH_COOKIE_EXPIRY = process.env.REFRESH_COOKIE_EXPIRY;
//require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
  const { firebaseToken } = req.body;
  console.log(firebaseToken);

  try {
    // // Step 1: Verify Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const userId = decodedToken.uid;
    //console.log("Decoded Token:", decodedToken);

    // Step 2: Generate JWTs for session management
    const accessToken = generateAccessToken(userId);
    //console.log(accessToken);
    const refreshToken = generateRefreshToken(userId);
    console.log("Generated Tokens:");
    //console.log(accessToken,refreshToken);

    // Step 3: Set HTTP-only cookies for access and refresh tokens
    // res.cookie('access_token', accessToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // true in production, false in development
    //   sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // 'None' in production, 'Strict' in development    
    //   // maxAge: 900 * 1000, // 1 hour
    //   maxAge: 10 * 1000, // 10 seconds for testing
    // });

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true in production, false in development
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // 'None' in production, 'Strict' in development    
      // maxAge: 900 * 1000, // 1 hour
      maxAge: 10 * 1000, // 10 minutes
    });
    
    // res.cookie('refresh_token', refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production', // secure in production
    //   sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // 'None' in production, 'Strict' in development   
    //   // maxAge: 7 * 24 * 3600 * 1000, // 7 days
    //   maxAge: 1 * 20 * 1000, // 1 minute for testing
    // });
    
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // secure in production
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict', // 'None' in production, 'Strict' in development   
      // maxAge: 7 * 24 * 3600 * 1000, // 7 days
      maxAge: 20 * 1000, // 1 minute for testing
    });

    // Step 4: Send success response
    console.log('Login successful for user:', userId);
    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Firebase token verification failed:', error);
    return res.status(401).json({ message: 'Invalid Firebase token' });
  }
});

module.exports = router;

//For development, set sameSite to strict and secure to false, and for production, set sameSite to none and secure to true. It works that way.