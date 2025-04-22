import sql from "mssql"; // Using the regular mssql driver instead of msnodesqlv8

const config = {
  database: process.env.DB_NAME || "master",
  server: process.env.DB_SERVER || "",
  user: process.env.DB_USER || "", 
  password: process.env.DB_PASSWORD || "",
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_TRUST_CERT === "true"
  },
};

// Create a pool once for better performance
let pool: sql.ConnectionPool | null = null;

export async function connectToDatabase() {
  try {
    if (!pool) {
      pool = await new sql.ConnectionPool(config).connect();
      console.log("Connected to the database successfully!");
    }
    return pool;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    throw err;
  }
}

export async function testConnection() {
  try {
    const pool = await connectToDatabase();
    const result = await pool.request().query('SELECT 1 as test');
    return { success: true, data: result.recordset };
  } catch (err) {
    console.error("Database test connection failed:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

// Generic query execution function
export async function executeQuery<T = unknown>(query: string, params: Record<string, unknown> = {}): Promise<T[]> {
  try {
    const pool = await connectToDatabase();
    const request = pool.request();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.query(query);
    return result.recordset as T[];
  } catch (err) {
    console.error("Query execution failed:", err);
    throw err;
  }
}

// Transaction helper function
export async function withTransaction<T>(callback: (transaction: sql.Transaction) => Promise<T>): Promise<T> {
  const pool = await connectToDatabase();
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (err) {
    await transaction.rollback();
    console.error("Transaction failed:", err);
    throw err;
  }
}
