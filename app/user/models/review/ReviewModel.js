/**
 * ReviewModel.js - Gọi API Review từ Backend
 * Quản lý tất cả API calls cho feature Review
 */

class ReviewModel {
    constructor() {
        // ⚠️ CHANGE THIS: Thay bằng URL backend của bạn
        // Backend Spring Boot chạy trên: http://localhost:8080
        this.apiBaseUrl = 'http://localhost:8080/api/v1/reviews';
        this.token = localStorage.getItem('token');
    }

    /**
     * Helper function - Gọi API
     * @param {string} endpoint - Full URL endpoint
     * @param {string} method - GET/POST/PUT/DELETE
     * @param {object} data - Request body
     * @returns {Promise} Response JSON
     */
    async fetchAPI(endpoint, method = 'GET', data = null) {
        const headers = {
            'Content-Type': 'application/json'
        };

        // Thêm token vào header nếu có
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const options = {
            method,
            headers
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            console.log(`[ReviewModel] ${method} ${endpoint}`);
            const response = await fetch(endpoint, options);

            if (!response.ok) {
                const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                console.error(`[ReviewModel] ${errorMessage}`);
                throw new Error(errorMessage);
            }

            const json = await response.json();
            return json;
        } catch (error) {
            console.error('[ReviewModel] Error:', error.message);
            throw error;
        }
    }

    /**
     * Lấy tất cả reviews
     * GET /api/v1/reviews
     * Response: [{ id, userId, bookId, rating, comment, createdAt, updatedAt }, ...]
     */
    async getAllReviews() {
        const reviews = await this.fetchAPI(this.apiBaseUrl);
        console.log('[ReviewModel] getAllReviews - Count:', reviews.length);
        if (reviews.length > 0) {
            console.log('[ReviewModel] First review:', {
                id: reviews[0].id,
                userId: reviews[0].userId,
                rating: reviews[0].rating,
                createdAt: reviews[0].createdAt,
                updatedAt: reviews[0].updatedAt,
                fullObject: reviews[0]
            });
        }
        return reviews;
    }

    /**
     * Lấy review theo ID
     * GET /api/v1/reviews/{id}
     * Response: { id, userId, bookId, rating, comment, createdAt, updatedAt }
     */
    async getReviewById(id) {
        const review = await this.fetchAPI(`${this.apiBaseUrl}/${id}`);
        console.log('[ReviewModel] getReviewById - ID:', id, 'CreatedAt:', review.createdAt);
        return review;
    }

    /**
     * Lấy reviews theo bookId
     * GET /api/v1/reviews/book/{bookId}
     */
    async getReviewsByBookId(bookId) {
        const reviews = await this.fetchAPI(`${this.apiBaseUrl}/book/${bookId}`);
        console.log('[ReviewModel] getReviewsByBookId - BookID:', bookId, 'Count:', reviews.length);
        return reviews;
    }

    /**
     * Tạo review mới
     * POST /api/v1/reviews
     * Request: { userId, bookId, rating, comment }
     * Response: { id, userId, bookId, rating, comment, createdAt, updatedAt }
     */
    async createReview(formData) {
        const payload = {
            userId: formData.userId,
            bookId: formData.bookId,
            rating: formData.rating,
            comment: formData.comment
        };
        const response = await this.fetchAPI(this.apiBaseUrl, 'POST', payload);
        console.log('[ReviewModel] createReview - New ID:', response.id, 'CreatedAt:', response.createdAt);
        return response;
    }

    /**
     * Cập nhật review
     * PUT /api/v1/reviews/{id}
     * Response: { id, userId, bookId, rating, comment, createdAt, updatedAt }
     */
    async updateReview(id, formData) {
        const payload = {
            userId: formData.userId,
            bookId: formData.bookId,
            rating: formData.rating,
            comment: formData.comment
        };
        const response = await this.fetchAPI(`${this.apiBaseUrl}/${id}`, 'PUT', payload);
        console.log('[ReviewModel] updateReview - ID:', id, 'UpdatedAt:', response.updatedAt);
        return response;
    }

    /**
     * Xóa review
     * DELETE /api/v1/reviews/{id}
     */
    async deleteReview(id) {
        return await this.fetchAPI(`${this.apiBaseUrl}/${id}`, 'DELETE');
    }
}
