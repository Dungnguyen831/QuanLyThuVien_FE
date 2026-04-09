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
     * Cancel a reservation
     * @param {string|number} reservationId - ID of the reservation to cancel
     * @returns {Promise<Object>} Result of cancellation
     */
    async cancelReservation(reservationId) {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('User not authenticated.');
            }

            // ✅ Authorization header attached
            const response = await fetch(`${this.apiBaseUrl}/reservations/${reservationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('User not authenticated.');
            }

            // ✅ Authorization header attached
            const response = await fetch(`${this.apiBaseUrl}/reservations/${reservationId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('User not authenticated. Please login first.');
            }

            // ✅ NEW ENDPOINT: No userId in path - backend extracts from JWT
            const response = await fetch(`${this.apiBaseUrl}/reservations/details`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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

    /**
     * Create a new reservation
     * @param {number|string} bookId - ID of the book to reserve
     * @param {string} reservationDate - Desired reservation/pickup date (LocalDateTime format: YYYY-MM-DDTHH:mm:ss)
     * @param {string} status - Status (default: PENDING)
     * @returns {Promise<Object>} Created reservation object
     */
    async createReservation(bookId, reservationDate, status = 'PENDING') {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('User not authenticated.');
            }

            // Note: userId is extracted from JWT token on backend side
            const response = await fetch(`${this.apiBaseUrl}/reservations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookId: parseInt(bookId),
                    reservationDate: reservationDate,
                    status: status
                    // userId NOT sent - backend extracts from JWT
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.message || `HTTP error! status: ${response.status}`;
                throw new Error(errorMsg);
            }

            const result = await response.json();
            console.log('Reservation created:', result);
            return result;
        } catch (error) {
            console.error('Error creating reservation:', error);
            throw error;
        }
    }

    /**
     * Update an existing reservation
     * ✅ CRITICAL: Sends bookId, reservationDate, status to backend
     * ✅ SECURITY: Always validates ID > 0 before sending
     * ✅ API: ID must be in URL path: /api/v1/reservations/{id}
     * 
     * @param {number|string} reservationId - ID of the reservation to update (must be > 0)
     * @param {Object} updateData - Data to update { bookId, reservationDate, status }
     * @returns {Promise<Object>} Updated reservation object
     */
    async updateReservation(reservationId, updateData) {
        try {
            // ✅ 1. Validate ID - must be positive integer
            const id = parseInt(reservationId);
            if (!id || id <= 0) {
                throw new Error('ID đặt chỗ không hợp lệ. Phải là số dương.');
            }

            console.log('[ReservationModel] Updating reservation:', { id, formData: updateData });

            // ✅ 2. Check authentication
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
            }

            // ✅ 3. Prepare request body (bookId, reservationDate, status - NO id field!)
            const requestData = {
                bookId: parseInt(updateData.bookId),
                reservationDate: updateData.reservationDate,
                status: updateData.status
            };

            console.log('[ReservationModel] Sending request:', {
                method: 'PUT',
                url: `${this.apiBaseUrl}/reservations/${id}`,
                body: requestData
            });

            // ✅ 4. Fetch with ID in URL path
            const response = await fetch(
                `${this.apiBaseUrl}/reservations/${id}`,  // ← ID ở url path!
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(requestData)
                }
            );

            // ✅ 5. Handle different error responses
            if (!response.ok) {
                // Unauthorized - token expired
                if (response.status === 401) {
                    throw new Error('Phiên làm việc hết hạn. Vui lòng đăng nhập lại.');
                }

                // Bad request - validation error
                if (response.status === 400) {
                    const error = await response.json().catch(() => ({}));
                    throw new Error(error.message || 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
                }

                // Not found - reservation doesn't exist
                if (response.status === 404) {
                    throw new Error('Đặt chỗ không tồn tại hoặc không phải của bạn.');
                }

                // Other errors
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || `Cập nhật thất bại (${response.status})`);
            }

            // ✅ 6. Parse and return success response
            const result = await response.json();
            console.log('[ReservationModel] Update successful:', result);
            return result;

        } catch (error) {
            console.error('[ReservationModel] Error updating reservation:', error.message);
            throw error;
        }
    }
}