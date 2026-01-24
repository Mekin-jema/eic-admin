import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

// Type guard for Axios errors
export function isAxiosError<T = unknown>(error: unknown): error is AxiosError<T> {
  return (error as AxiosError).isAxiosError !== undefined;
}

/**
 * Centralized error handler
 * @param error - Unknown error
 * @param defaultMessage - Fallback error message
 */
export function handleError(error: unknown, defaultMessage: string = 'Something went wrong') {
  let message: string;
  console.log(error)
  if (isAxiosError<ApiErrorResponse>(error)) {
    // Check if backend explicitly returned a message, even on 400/other status
    if (error.response?.data?.message) {
      message = error.response.data.message;
    } else if (error.response?.data?.success === false && error.response.data.message) {
      message = error.response.data.message;
    } else {
      message = defaultMessage;
    }
  } else if (error instanceof Error) {
    message = error.message;
  } else {
    message = defaultMessage;
  }

  toast.error(message);
  return message; // return so components can handle it if needed
}
