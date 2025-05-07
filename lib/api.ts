"use client";

import { toast } from "sonner";

interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  params?: Record<string, string>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    credentials = "include",
    params = {},
  } = options;

  try {
    // Build URL with query parameters
    const url = new URL(
      endpoint.startsWith("/")
        ? `${window.location.origin}${endpoint}`
        : endpoint
    );

    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    // Build request configuration
    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials,
    };

    // Add body if provided
    if (body) {
      config.body = JSON.stringify(body);
    }

    // Make the request
    const response = await fetch(url.toString(), config);

    const contentType = response.headers.get("content-type");

    // Check if response is JSON
    let data: ApiResponse<T>;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      data = {
        success: response.ok,
        data: text as unknown as T,
      };
    }

    // Handle API error responses
    if (!response.ok) {
      const errorMessage =
        data.error?.message ||
        `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    // Handle application-level errors
    if (!data.success) {
      const errorMessage = data.error?.message || "Operation failed";
      throw new Error(errorMessage);
    }

    return data.data as T;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    // Re-throw the error for the caller to handle
    throw error;
  }
}

// Utility for common HTTP methods
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "GET", params }),

  post: <T>(endpoint: string, data?: any, params?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "POST", body: data, params }),

  put: <T>(endpoint: string, data?: any, params?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "PUT", body: data, params }),

  patch: <T>(endpoint: string, data?: any, params?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "PATCH", body: data, params }),

  delete: <T>(endpoint: string, params?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "DELETE", params }),
};
