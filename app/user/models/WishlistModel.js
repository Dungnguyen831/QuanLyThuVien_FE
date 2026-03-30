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

        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8080/api/v1';
        } else if (window.location.hostname !== '') {
            return `${window.location.protocol}//${window.location.hostname}:8080/api/v1`;
        } else {
            return '/api/v1'; // Relative path as fallback
        }
    }

    /**
     * Fetch wishlist data from API
     * @returns {Promise<Object>} Wishlist data object with books array
     */
    async getWishlist() {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User ID not found. Please login first.');
            }

            const response = await fetch(`${this.apiBaseUrl}/wishlists/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Wishlist data from BE:', data);

            return Array.isArray(data) ? { books: data } : data;
        } catch (error) {
            console.error('Error fetching wishlist from BE:', error);
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
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`${this.apiBaseUrl}/wishlists`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    bookId: parseInt(bookId)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle both JSON and plain text responses
            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                // Plain text response (e.g., success message)
                result = await response.text();
            }

            console.log('Remove from wishlist result:', result);
            return result;
        } catch (error) {
            console.error('Error removing from wishlist:', error);
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
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User not authenticated');
            }

            const response = await fetch(`${this.apiBaseUrl}/wishlists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: parseInt(userId),
                    bookId: parseInt(bookId)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle both JSON and plain text responses
            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                // Plain text response (e.g., success message)
                result = await response.text();
            }

            console.log('Add to wishlist result:', result);
            return result;
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            throw error;
        }
    }

    /**
     * Borrow all available books from wishlist
     * @returns {Promise<Object>} Result of borrowing
     */
    async borrowAll() {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User not authenticated');
            }

            // This endpoint needs to be confirmed with backend
            const response = await fetch(`${this.apiBaseUrl}/wishlists/borrow-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: parseInt(userId)
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Handle both JSON and plain text responses
            const contentType = response.headers.get('content-type');
            let result;

            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                // Plain text response (e.g., success message)
                result = await response.text();
            }

            console.log('Borrow all result:', result);
            return result;
        } catch (error) {
            console.error('Error borrowing books:', error);
            throw error;
        }
    }
}
