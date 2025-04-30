import sql from "mssql";
import { getConnection } from "./db"; // Import getConnection from the existing db file

// Define a type for the standardized success response
export interface SuccessResponse<T> {
  success: true;
  data: T;
}

// Define a type for the standardized error response
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
  };
}

// Union type for the response
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * Formats a successful response.
 * @param data The data payload.
 * @returns Standard success response object.
 */
function formatSuccessResponse<T>(data: T): SuccessResponse<T> {
  return { success: true, data };
}

/**
 * Formats an error response.
 * @param error The error object or message.
 * @param code Optional error code.
 * @returns Standard error response object.
 */
function formatErrorResponse(error: unknown, code?: string): ErrorResponse {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Database Query Error:", message, error); // Log the full error object too
  return { success: false, error: { message, code } };
}

/**
 * Executes a SQL query safely and returns a standardized response.
 * @param query The SQL query string.
 * @param params Optional parameters for the query.
 * @returns A promise resolving to a standard response object.
 */
export async function executeQuery<T = unknown>(
  query: string,
  params?: { [key: string]: unknown } // Use unknown instead of any
): Promise<ApiResponse<T[]>> {
  // Return type uses the ApiResponse union
  try {
    const request = await getConnection();
    if (params) {
      for (const key in params) {
        const value = params[key];

        // Handle null and undefined explicitly
        if (value === null || typeof value === "undefined") {
          request.input(key, value); // Let the driver handle null/undefined type inference
          continue; // Skip the rest of the loop for this parameter
        }

        // Determine SQL type based on JS type (can be expanded)
        let sqlType: sql.ISqlType | (() => sql.ISqlType); // Allow factory function type

        if (typeof value === "string") {
          // For strings, we need to specify length, so call the factory
          sqlType = sql.NVarChar(value.length > 0 ? value.length : sql.MAX); // Use actual length or MAX
        } else if (typeof value === "number" && Number.isInteger(value)) {
          sqlType = sql.Int; // Pass the factory function itself
        } else if (typeof value === "number") {
          sqlType = sql.Float; // Pass the factory function itself
        } else if (typeof value === "boolean") {
          sqlType = sql.Bit; // Pass the factory function itself
        } else if (value instanceof Date) {
          sqlType = sql.DateTime; // Pass the factory function itself
        } else {
          // Handle other types explicitly if needed
          // For now, default to NVarChar for unknown types or consider throwing an error
          console.warn(
            `Unknown type for parameter ${key}. Defaulting to NVarChar(MAX).`
          );
          sqlType = sql.NVarChar(sql.MAX); // Call factory with MAX length
        }

        request.input(key, sqlType, value);
      }
    }
    // Assuming the query returns an array of records of type T
    const result = await request.query<T>(query);
    return formatSuccessResponse(result.recordset);
  } catch (err) {
    // You might want more specific error codes based on the err type
    return formatErrorResponse(err, "DB_QUERY_FAILED");
  }
}

// Export formatters only if they need to be used directly elsewhere
// Typically, only executeQuery would be needed externally.
// export { formatSuccessResponse, formatErrorResponse };
