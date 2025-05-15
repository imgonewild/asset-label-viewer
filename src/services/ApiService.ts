/**
 * Service for making API calls to the backend
 *
 * Note: This is a placeholder service. In a production environment,
 * you would need to properly configure CORS and handle API URLs based
 * on environment variables.
 */

// Determine API base URL based on the current environment
const protocol = "https:";
const hostname = window.location.hostname;
const API_BASE_URL = `${protocol}//${hostname}:3000`;
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export const ApiService = {
  /**
   * Search for an item by label
   * @param label The label ID to search for
   */

  searchByLabel: async (label: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fetchLabel`, {
        method: "POST",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        body: JSON.stringify({ label }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },

  /**
   * Upload CSV data to the server
   * @param file The CSV file to upload
   */
  uploadCsv: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  },
};

export default ApiService;
