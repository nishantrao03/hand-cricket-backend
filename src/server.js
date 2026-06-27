const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const index = require('./routes/index');
const loginRoute = require('./auth_routes/loginRoute');
const logoutRoute = require('./auth_routes/logoutRoute');
const refreshTokenRoute = require('./auth_routes/refreshTokenRoute');
const accessTokenRoute = require('./auth_routes/accessTokenRoute');
const createUserRoute = require('./routes/createUser');
const fetchUserRoute = require('./routes/fetchUser');
const fetchMatchRoute = require('./routes/fetchMatch');
const sendFriendRequestRoute = require('./routes/sendFriendRequest');
const createMatchInvitationRoute = require('./routes/createMatchInvitation');
const fetchMatchInvitationRoute = require('./routes/fetchMatchInvitation');
const fetchMatchHistoryRoute = require('./routes/fetchMatchHistory');
const fetchFriendsRoute = require("./routes/fetchFriends");
const removeFriendRoute = require('./routes/removeFriend');
const acceptFriendRequestRoute = require('./routes/acceptFriendRequest');
const declineFriendRequestRoute = require('./routes/declineFriendRequest');
const fetchFriendRequestsRoute = require('./routes/fetchFriendRequests');
const updateUserRoute = require('./routes/updateUser');
const redisClient = require("./cache/client/redis");

const socketHandler = require("./socket/socketHandler");

const app = express();

const PORT =
    process.env.PORT || 4000;

app.use(express.json());

app.set('trust proxy', 1); 

app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'https://hand-cricket-frontend-pi.vercel.app'
];

app.use(
    cors({
        origin: function (
            origin,
            callback
        ) {

            if (
                !origin ||
                allowedOrigins.indexOf(origin) !== -1
            ) {

                callback(
                    null,
                    true
                );

            } else {

                callback(
                    new Error(
                        'Not allowed by CORS'
                    )
                );
            }
        },

        methods: [
            'GET',
            'POST',
            'PUT',
            'DELETE',
            'OPTIONS'
        ],

        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ],

        credentials: true
    })
);

app.use(index);

app.use(loginRoute);

app.use(logoutRoute);

app.use(refreshTokenRoute);

app.use(accessTokenRoute);

app.use(createUserRoute);

app.use(fetchUserRoute);

app.use(sendFriendRequestRoute);

app.use(fetchMatchRoute);

app.use(createMatchInvitationRoute);

app.use(fetchMatchInvitationRoute);

app.use(fetchMatchHistoryRoute);

app.use(fetchFriendsRoute);

app.use(removeFriendRoute);

app.use(acceptFriendRequestRoute);

app.use(declineFriendRequestRoute);

app.use(fetchFriendRequestsRoute);

app.use(updateUserRoute);

const server =
    http.createServer(app);

const io =
    new Server(
        server,
        {
            cors: {

                origin:
                    allowedOrigins,

                credentials: true
            }
        }
    );

socketHandler(io);

async function startServer() {
    try {
        await redisClient.connect();
        console.log("Connected");

        const response = await redisClient.ping();
        console.log("PING:", response);

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error(err);
    }
}

startServer();