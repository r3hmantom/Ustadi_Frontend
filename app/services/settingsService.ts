import { UserProfile } from "@/db/types";

export interface ProfileUpdateData {
  email?: string;
  full_name?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
}

/**
 * Updates the user's profile information
 */
export const updateProfile = async (
  data: ProfileUpdateData
): Promise<UserProfile> => {
  const response = await fetch("/api/settings/profile", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.error?.message ||
        `Failed to update profile: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.success && result.data) {
    return result.data;
  } else {
    throw new Error(result.error?.message || "Failed to update profile");
  }
};

/**
 * Changes the user's password
 */
export const changePassword = async (
  data: PasswordChangeData
): Promise<void> => {
  const response = await fetch("/api/settings/change-password", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData?.error?.message ||
        `Failed to change password: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error?.message || "Failed to change password");
  }
};
