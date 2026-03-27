/**
 * Reservation Model Class
 * Handles data fetching and business logic for reservations
 * Communicates with the backend API
 */
class ReservationModel {
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
     * Fetch user dashboard data including stats and reservations
     * @param {number} page - Page number (0-indexed), default: 0
     * @param {number} size - Page size, default: 10
     * @param {string} sort - Sort field with direction (e.g., "createdAt,desc"), default: "createdAt,desc"
     * @returns {Promise<Object>} Dashboard data object with stats and reservations array
     */
    async fetchUserDashboardData(page = 0, size = 10, sort = 'createdAt,desc') {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User ID not found. Please login first.');
            }

            // Build URL with pagination parameters
            const url = new URL(`${this.apiBaseUrl}/reservations/user/${userId}`);
            url.searchParams.append('page', page);
            url.searchParams.append('size', size);
            url.searchParams.append('sort', sort);

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Reservation data from BE:', data);

            // Handle paginated response from Spring Boot Page
            // Backend returns either Page<ReservationResponseDTO> or EmptyPageResponse
            if (data.content) {
                // Page response structure
                return {
                    reservations: data.content,
                    pagination: {
                        totalElements: data.totalElements,
                        totalPages: data.totalPages,
                        currentPage: data.number,
                        pageSize: data.size,
                        empty: data.empty
                    }
                };
            } else if (data.totalElements === 0) {
                // EmptyPageResponse structure
                return {
                    reservations: [],
                    pagination: {
                        totalElements: 0,
                        totalPages: 0,
                        currentPage: 0,
                        pageSize: size,
                        empty: true
                    },
                    message: data.message
                };
            } else if (Array.isArray(data)) {
                // Fallback: if data is already an array
                return { reservations: data };
            } else {
                // Other response formats
                return data;
            }
        } catch (error) {
            console.error('Error fetching reservation from BE:', error);
            throw error;
        }
    }

    /**
     * Cancel a reservation
     * @param {string|number} reservationId - ID of the reservation to cancel
     * @returns {Promise<Object>} Result of cancellation
     */
    async cancelReservation(reservationId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
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

            console.log('Cancel reservation result:', result);
            return result;
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            throw error;
        }
    }

    /**
     * Get reservation details
     * @param {string|number} reservationId - ID of the reservation
     * @returns {Promise<Object>} Detailed reservation data
     */
    async getReservationDetails(reservationId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/reservations/${reservationId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Reservation details:', result);
            return result;
        } catch (error) {
            console.error('Error fetching reservation details:', error);
            throw error;
        }
    }

    /**
     * Get user's reservations with FULL book details
     * ✅ Returns custom object kết hợp Reservation + Book information
     * ✅ Includes: reservationDate, status, book title, isbn, imageUrl, qty...
     * 
     * @returns {Promise<Array>} Array of combined reservation+book objects with full details
     */
    async getUserReservationsWithBooks() {
        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                throw new Error('User ID not found. Please login first.');
            }

            const response = await fetch(`${this.apiBaseUrl}/reservations/user/${userId}/all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reservations = await response.json();
            console.log('Reservations with book details from BE:', reservations);

            // Return array of combined reservation+book objects
            return Array.isArray(reservations) ? reservations : [];
        } catch (error) {
            console.error('Error fetching reservations with book details from BE:', error);
            throw error;
        }
    }
}