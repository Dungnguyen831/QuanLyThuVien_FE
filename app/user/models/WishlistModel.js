/**
 * Wishlist Model Class
 * Handles data fetching and business logic for wishlist
 * Communicates with the backend API
 */
class WishlistModel {
  constructor() {
    // Auto-detect API base URL
    // You can override by setting window.API_BASE_URL before loading this script
    this.apiBaseUrl = window.API_BASE_URL || this._getDefaultApiUrl();
  }

  /**
   * Get default API URL based on current environment
   * @private
   * @returns {string} API base URL
   */
  _getDefaultApiUrl() {
    // Priority:
    // 1. If on localhost - use localhost:8080
    // 2. If on any other host - use same host with /api/v1
    // 3. Fallback to /api/v1 (relative path)

    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8080/api/v1";
    } else if (window.location.hostname !== "") {
      return `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
    } else {
      return "/api/v1"; // Relative path as fallback
    }
  }

  /**
   * Fetch wishlist data from API
   * @returns {Promise<Object>} Wishlist data object with books array
   */
  async getWishlist() {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User not authenticated. Please login first.");
      }

      // ✅ NEW ENDPOINT: No userId in path - backend extracts from JWT
      const response = await fetch(
        `${this.apiBaseUrl}/wishlists`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Wishlist data from BE:", data);

      return Array.isArray(data) ? { books: data } : data;
    } catch (error) {
      console.error("Error fetching wishlist from BE:", error);
      throw error;
    }
  }

  /**
   * Remove a book from wishlist
   * @param {string|number} bookId - ID of the book to remove
   * @returns {Promise<Object>} Result of removal
   */
  async removeFromWishlist(bookId) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User not authenticated. Please login first.");
      }

      // ✅ NEW ENDPOINT: No userId in body - backend uses JWT to identify user
      const response = await fetch(`${this.apiBaseUrl}/wishlists/${bookId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Remove from wishlist response status:', response.status);

      // Handle different response statuses - 404 means already removed, treat as success
      if (!response.ok && response.status !== 400 && response.status !== 404) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Server error response:', errorData);
        } catch (e) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
        }
        throw new Error(errorMessage);
      }

      // Handle both JSON and plain text responses
      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // Plain text response (e.g., success message)
        result = await response.text();
      }

      console.log("Remove from wishlist result:", result);

      // If we got a 400 error response, log it but don't throw
      if (response.status === 400) {
        console.warn('Backend returned 400 - validation issue but operation may have succeeded:', result);
      }

      // If 404, it means item was already removed (treat as success)
      if (response.status === 404) {
        console.log('Item not found in wishlist (already removed)');
      }

      return result;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      throw error;
    }
  }

  /**
   * Add a book to wishlist
   * @param {string|number} bookId - ID of the book to add
   * @returns {Promise<Object>} Result of addition
   */
  async addToWishlist(bookId) {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User not authenticated. Please login first.");
      }

      console.log('Adding to wishlist - bookId type:', typeof bookId, 'value:', bookId);

      // ✅ NEW ENDPOINT: No userId in body - backend uses JWT to identify user
      const response = await fetch(`${this.apiBaseUrl}/wishlists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId: parseInt(bookId),
        }),
      });

      console.log('Add to wishlist response status:', response.status);

      // Handle different response statuses
      if (!response.ok && response.status !== 400) {
        // Only throw for real server errors, not validation errors
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Server error response:', errorData);
        } catch (e) {
          const errorText = await response.text();
          console.error('Error response text:', errorText);
        }
        throw new Error(errorMessage);
      }

      // Handle both JSON and plain text responses
      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // Plain text response (e.g., success message)
        result = await response.text();
      }

      console.log("Add to wishlist result:", result);

      // If we got a 400 error response, log it but don't throw
      if (response.status === 400) {
        console.warn('Backend returned 400 - validation issue but operation may have succeeded:', result);
      }

      return result;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }
}
