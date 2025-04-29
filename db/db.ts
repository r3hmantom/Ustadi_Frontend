import sql from "mssql";

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER || "", // Provide a default empty string if undefined
  database: process.env.DB_NAME,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true", // Convert string to boolean
    trustServerCertificate: process.env.DB_TRUST_CERT === "true", // Convert string to boolean
  },
};

let pool: sql.ConnectionPool | null = null;

async function connectDb() {
  if (pool) {
    return pool;
  }
  try {
    pool = await sql.connect(config);
    console.log("Connected to SQL Server");
    return pool;
  } catch (err) {
    console.error("Database Connection Failed! Bad Config: ", err);
    // Rethrow the error or handle it appropriately
    throw err;
  }
}

// Function to get a connection from the pool
export async function getConnection() {
  const connectionPool = await connectDb();
  if (!connectionPool) {
    throw new Error("Failed to establish database connection pool.");
  }
  return connectionPool.request(); // Get a request object from the pool
}

// Optional: Export the pool directly if needed elsewhere, though getConnection is generally safer
export { pool, connectDb };
