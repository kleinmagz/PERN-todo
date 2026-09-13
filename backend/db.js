import { Pool } from "pg";

// a pool manages multple client connections
// Opening every connection for requests is slow
// a pool keeps connections open and reuse them - efficient++

const pool = new Pool({
   user: "postgres",
   password: "123123",
   host: "localhost",
   port: 5432,
   database: "tododb"
})

export default pool;