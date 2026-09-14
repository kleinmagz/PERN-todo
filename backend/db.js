import { Pool } from "pg";
import { configDotenv } from "dotenv";
// a pool manages multple client connections
// Opening every connection for requests is slow
// a pool keeps connections open and reuse them - efficient++

// FOR LOCAL
// const pool = new Pool({
//    user: "postgres",
//    password: "******",
//    host: "localhost",
//    port: 5432,
//    database: "tododb"
// })

configDotenv();
// FOR NEON
console.log("Conncecting to:", process.env.DATABASE_URL);
const pool = new Pool ({
   connectionString: process.env.DATABASE_URL,
   ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

export default pool;