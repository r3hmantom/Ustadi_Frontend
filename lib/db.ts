import sql from 'mssql';

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: process.env.NODE_ENV !== 'production' // for local dev
  }
};

// Create a connection pool
let pool: sql.ConnectionPool | null = null;

export async function getConnection() {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    
    // Setup event handlers
    pool.on('error', (err) => {
      console.error('SQL connection pool error:', err);
      pool = null;
    });
    
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

// Helper function to execute queries
export async function executeQuery<T>(query: string, params: Record<string, any> = {}): Promise<T[]> {
  try {
    const pool = await getConnection();
    const request = pool.request();
    
    // Add parameters to the request
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.query(query);
    return result.recordset as T[];
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
}

// Helper function for transactions
export async function withTransaction<T>(callback: (transaction: sql.Transaction) => Promise<T>): Promise<T> {
  const pool = await getConnection();
  const transaction = new sql.Transaction(pool);
  
  try {
    await transaction.begin();
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    console.error('Transaction error:', error);
    throw error;
  }
}