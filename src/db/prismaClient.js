// import "dotenv/config";
// import { PrismaClient } from "@prisma/client";
// import { Pool } from "pg";
// import { PrismaPg } from "@prisma/adapter-pg";

// // Initialize a database connection pool using the environment variable
// const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// // Create the driver adapter using the pool
// const adapter = new PrismaPg(pool);

// // Instantiate PrismaClient with the adapter configuration
// const prisma = new PrismaClient({ adapter });

// export default prisma;

require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const pool = new Pool({
    connectionString:
        process.env.DATABASE_URL
});

const adapter =
    new PrismaPg(pool);

const prisma =
    new PrismaClient({
        adapter
    });

module.exports =
    prisma;