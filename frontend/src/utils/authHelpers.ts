import jwtDecode from "jwt-decode";
import hasOwnProperty from "utils/hasOwnProperty";
import { AxiosRequestConfig } from "axios";
import UserRoles from "utils/UserRoles";

// Define key for storing and retrieving a stored JWT token from local storage
const STORAGE_AUTH_KEY = "auth";

// Define structure of expected JWT tokens (username to identify user and role
// to identify what user is authorized to do)
interface UserJwt {
  username: string;
  role: UserRoles;
}

// Decode JWT token from local storage and return the decoded token provided it
// can be decoded and it follows the general contract of UserJwt. If not,
// return null to indicate the user is not authenticated.
//
// Note: This method does not validate the token's signature. It merely decodes
//       the payload (if possible). Validation should be done via call to API.
const decodeAuthToken = (): UserJwt | null => {
  let payload: Object = {};
  const authToken = localStorage.getItem(STORAGE_AUTH_KEY) || "";

  try {
    payload = jwtDecode(authToken);
  } catch (e) {
    return null;
  }

  if (
    hasOwnProperty(payload, "username") &&
    typeof payload.username === "string" &&
    hasOwnProperty(payload, "role") &&
    typeof payload.role === "string" &&
    payload.role in UserRoles
  ) {
    return {
      // @ts-ignore
      role: payload.role,
      username: payload.username,
    };
  }

  return null;
};

// Store a given JWT token into local storage (no checks are performed)
const setAuthToken = (token: string) => {
  localStorage.setItem(STORAGE_AUTH_KEY, token);
};

// Remove the stored (or absent) JWT token from local storage
const removeAuthToken = () => {
  localStorage.removeItem(STORAGE_AUTH_KEY);
};

// Construct header with bearer authentication scheme using JWT token from
// local storage (if no JWT token is found, it is constructed as "Bearer null")
const getAuthHeader = (): AxiosRequestConfig => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem(STORAGE_AUTH_KEY)}`,
  },
});

export { decodeAuthToken, setAuthToken, removeAuthToken, getAuthHeader };
