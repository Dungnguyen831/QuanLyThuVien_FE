/**
 * AllBooksModel
 * Handles API communication for the All Books page
 * Fetches books, categories, and related data
 */
class AllBooksModel {
    constructor() {
        this.apiBooksUrl = 'http://localhost:8080/api/v1/books';
        this.apiCategoriesUrl = 'http://localhost:8080/api/v1/categories';
    }

    /**
     * Get authorization header with token
     * @private
     * @returns {Object} Headers object with authorization
     */
    _getHeaders() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` })
        };
    }

    /**
     * Fetch all books from API
     * @returns {Promise<Array>} Array of book objects
     */
    async fetchAllBooks() {
        try {
            const response = await fetch(this.apiBooksUrl, {
                method: "GET",
                headers: this._getHeaders()
            });

            if (!response.ok) {
                console.warn(`API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            console.log("Books from API:", data);

            // Handle both array and object response formats
            return Array.isArray(data) ? data : (data.data || data.books || []);
        } catch (error) {
            console.error("Error fetching books:", error);
            return [];
        }
    }

    /**
     * Fetch all categories from API
     * @returns {Promise<Array>} Array of category objects
     */
    async fetchCategories() {
        try {
            const response = await fetch(this.apiCategoriesUrl, {
                method: "GET",
                headers: this._getHeaders()
            });

            if (!response.ok) {
                console.warn(`API error: ${response.status}`);
                return [];
            }

            const data = await response.json();
            console.log("Categories from API:", data);

            return Array.isArray(data) ? data : (data.data || data.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }
}
