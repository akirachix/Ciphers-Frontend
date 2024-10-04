
export interface AdminRegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}
export interface RegistrationSuccessResponse {
  message: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
}
export interface AdminRegistrationErrorResponse {
  error: string;
}
export interface AdminRegistrationState {
  loading: boolean;
  errorMessage: string;
  successMessage: string;
}
export type FetchAdminFunction = (data: AdminRegistrationData) => Promise<RegistrationSuccessResponse>;
export interface UserProfileData {
  first_name: string;
  last_name: string;
  email: string;
}
export interface LoginCredentials {
  email: string;
  password: string;
}