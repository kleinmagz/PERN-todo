import { Pool } from "pg";
import "dotenv/config"
// a pool manages multple client connections
// Opening every connection for requests is slow
// a pool keeps connections open and reuse them - efficient++

// FOR LOCAL
// const pool = new Pool({
//    user: "postgres",
//    password: "123123",
//    host: "localhost",
//    port: 5432,
//    database: "tododb"
// })

// FOR NEON
console.log("Conncecting to:", process.env.DATABASE_URL);
const pool = new Pool ({
   connectionString: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false },
});

export default pool;