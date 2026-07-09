# Hand Cricket Backend

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-24.15.0-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socketdotio)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-316192?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![JWT](https://img.shields.io/badge/JWT-Authorization-000000?style=for-the-badge&logo=jsonwebtokens)

</p>

Backend server powering the **Hand Cricket** multiplayer web application.

The backend is responsible for secure authentication, REST APIs, real-time gameplay using Socket.IO, match state management, caching, and persistent storage.

---

## Live Application

Frontend: https://hand-cricket-frontend-pi.vercel.app/

---

# Features

- JWT authentication using access & refresh token cookies
- Firebase Authentication (Email/Password + Google Sign-In)
- Secure protected REST APIs
- Real-time multiplayer gameplay using Socket.IO
- Match invitation system
- Friend & Friend Request management
- PostgreSQL database with Prisma ORM
- Redis caching for optimized data access
- Match reconnection & state restoration
- Automatic timeout handling
- Match abandonment handling
- Match history persistence
- Scalable modular backend architecture

---

# Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | REST APIs |
| Socket.IO | Real-time gameplay |
| PostgreSQL | Database |
| Prisma | ORM |
| Redis | Caching |
| Firebase Admin SDK | Authentication |
| JWT | Authorization |
| Render | Deployment |

---

# Project Structure

```
src/
│
├── auth_routes/       # Authentication endpoints
├── auth_utils/        # Authentication utilities
├── cache/             # Redis cache management
├── config/            # Application configuration
├── db/                # Database tools & queries
├── game/              # Match engine & game logic
├── jwt/               # JWT generation & verification
├── routes/            # Application REST APIs
├── socket/            # Socket.IO event handlers
├── test/              # Testing utilities
│
├── firebase-admin.js
└── server.js
```

---

# Authentication Flow

- Firebase verifies user identity.
- Backend issues Access & Refresh JWT tokens.
- Tokens are stored securely as HTTP-only cookies.
- Every protected request is authenticated before execution.
- Refresh token automatically renews expired access tokens.

---

# Gameplay Flow

- Player creates a private match invitation.
- Opponent joins using invitation link.
- Both players connect through Socket.IO.
- Toss determines batting or bowling order.
- Players submit moves simultaneously.
- Server validates match rules.
- Scoreboard updates in real time.
- Match state is restored after reconnection.
- Completed matches are stored in PostgreSQL.

---

# Caching Strategy

Redis is used to reduce unnecessary database queries.

Cached resources include:

- User information
- Friend lists
- Friend requests
- Match invitations
- Active match state

Cache is updated whenever underlying data changes to maintain consistency.

---

## Environment Variables

Create a `.env` file using the provided `.env.example`.

The application requires configuration for:

- PostgreSQL
- Redis
- JWT
- Firebase Admin SDK

See `.env.example` for the complete list of required variables.

---

# Installation

Clone the repository

```bash
git clone https://github.com/nishantrao03/hand-cricket-backend.git
```

Go inside the project

```bash
cd hand-cricket-backend
```

Install dependencies

```bash
npm install
```

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate deploy
```

Start the server

```bash
npm start
```

---

# API Overview

### Authentication

- Login
- Google Sign-In
- Refresh Token
- Logout

### User

- Register User
- Update Profile
- View Profile

### Friends

- Send Friend Request
- Accept Request
- Reject Request
- Remove Friend
- Friend List

### Matches

- Create Match Invitation
- Join Match
- Match History
- Match Details

---

# Deployment

Backend is deployed on **Render**.

---

# Frontend Repository

https://github.com/nishantrao03/hand-cricket-frontend

---

# License

This project is licensed under the MIT License.