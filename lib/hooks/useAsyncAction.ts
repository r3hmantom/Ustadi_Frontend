"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

interface AsyncActionOptions {
  loadingMessage?: string;
  successMessage?: string;
  errorMessage?: string;
  showLoadingToast?: boolean;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

/**
 * Custom hook for managing async operations with loading, error states and toast notifications
 */
export function useAsyncAction<T extends (...args: any[]) => Promise<any>>(
  asyncFn: T,
  options: AsyncActionOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    loadingMessage = "Loading...",
    successMessage = "Operation completed successfully.",
    errorMessage = "An error occurred",
    showLoadingToast = false,
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const execute = useCallback(
    async (...args: Parameters<T>): Promise<ReturnType<T> | undefined> => {
      let toastId;
      try {
        setIsLoading(true);
        setError(null);

        if (showLoadingToast) {
          toastId = toast.loading(loadingMessage);
        }

        const result = await asyncFn(...args);

        if (showSuccessToast) {
          if (toastId) {
            toast.success(successMessage, { id: toastId });
          } else {
            toast.success(successMessage);
          }
        } else if (toastId) {
          toast.dismiss(toastId);
        }

        return result as ReturnType<T>;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);

        if (showErrorToast) {
          if (toastId) {
            toast.error(`${errorMessage}: ${errorMsg}`, { id: toastId });
          } else {
            toast.error(`${errorMessage}: ${errorMsg}`);
          }
        } else if (toastId) {
          toast.dismiss(toastId);
        }

        console.error("Async action error:", err);
        return undefined;
      } finally {
        if (!toastId) setIsLoading(false);
      }
    },
    [
      asyncFn,
      loadingMessage,
      successMessage,
      errorMessage,
      showLoadingToast,
      showSuccessToast,
      showErrorToast,
    ]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    execute,
    isLoading,
    error,
    clearError,
  };
}

export default useAsyncAction;
