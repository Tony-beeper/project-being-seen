import axios from "axios";

// Define a base axios instance with a base URL. This prevents repetition
// associated with prefixing calls with protocol, domain, path, and version.
const axiosBase = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export default axiosBase;
