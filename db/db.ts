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
  // If pool exists, check if it's connected before returning it
  if (pool) {
    // Check if the connection is still valid
    try {
      await pool.query("SELECT 1"); // Test the connection with a simple query
      return pool;
    } catch {
      // If the query fails, the connection is likely closed
    }
    return pool;
  }
  // If connection is closed, continue to create a new one

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
