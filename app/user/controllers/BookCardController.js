/**
 * BookCard Controller
 * Handles data processing, utilities, and business logic for BookCard component
 * 
 * Responsibilities:
 * - Image URL resolution with fallback strategies
 * - Author/Category/Availability data formatting
 * - API base URL detection
 * - HTML escaping for XSS prevention
 */
class BookCardController {
    /**
     * Get image URL from flexible field names with proper path resolution
     * Uses ImageService if available, otherwise handles path resolution manually
     * Tries: imageUrl → cover → imageUri → image → thumb (in order)
     * @static
     * @param {Object} book - Book object
     * @param {string} fieldName - Specific field name to use
     * @returns {string} - Image URL or empty string
     */
    static getImageUrl(book, fieldName) {
        if (!book) return '';

        // ✅ Use ImageService if available
        if (typeof ImageService !== 'undefined') {
            try {
                let imagePath = '';

                // If specific field is provided, use it
                if (fieldName && book[fieldName]) {
                    imagePath = book[fieldName];
                } else {
                    // Try common field names from backend
                    const imageFields = ['imageUrl', 'image_url', 'cover', 'coverImage', 'imageUri', 'image', 'thumb'];
                    for (const field of imageFields) {
                        if (book[field]) {
                            imagePath = book[field];
                            break;
                        }
                    }
                }

                if (imagePath) {
                    return ImageService.getImageUrl(imagePath);
                }
            } catch (error) {
                console.warn('Lỗi ImageService, quay trở lại phân giải thủ công:', error);
            }
        }

        // Fallback: Manual URL construction
        let imagePath = '';

        // If specific field is provided, use it
        if (fieldName && book[fieldName]) {
            imagePath = book[fieldName];
        } else {
            // Try common field names from backend
            const imageFields = ['imageUrl', 'image_url', 'cover', 'coverImage', 'imageUri', 'image', 'thumb'];
            for (const field of imageFields) {
                if (book[field]) {
                    imagePath = book[field];
                    break;
                }
            }
        }

        if (!imagePath) return '';

        // ✅ If already absolute URL (http/https), return as-is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // ✅ Try backend API first
        const backendUrl = BookCardController.getApiBaseUrl();
        if (backendUrl) {
            return `${backendUrl}/api/v1/images/${encodeURIComponent(imagePath)}`;
        }

        // ✅ Fallback: local assets folder
        return `/assets/img/${encodeURIComponent(imagePath)}`;
    }

    /**
     * Get API base URL based on current environment
     * @static
     * @returns {string} - API base URL (without /api/v1)
     */
    static getApiBaseUrl() {
        // Check for global API URL override
        if (window.API_BASE_URL) {
            return window.API_BASE_URL.replace(/\/api\/v1$/, '');
        }

        // Auto-detect from current location
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:8080';
        } else if (window.location.hostname !== '') {
            return `${window.location.protocol}//${window.location.hostname}:8080`;
        } else {
            return '';
        }
    }

    /**
     * Get author display name
     * Handles different data structures (author object or author_id)
     * @static
     * @param {Object} book - Book object
     * @returns {string} - Author name or "Unknown Author"
     */
    static getAuthorDisplay(book) {
        if (!book) return 'Unknown Author';

        // Direct author name
        if (typeof book.author === 'string') {
            return book.author;
        }

        // Author object with name property
        if (book.author && book.author.name) {
            return book.author.name;
        }

        // Author name field from API (new field from backend)
        if (book.author_name) {
            return book.author_name;
        }

        // Author ID fallback
        if (book.author_id || book.authorId) {
            return `Author #${book.author_id || book.authorId}`;
        }

        return 'Unknown Author';
    }

    /**
     * Get availability badge HTML
     * Shows available quantity vs total quantity
     * @static
     * @param {Object} book - Book object
     * @returns {string} - HTML badge string
     */
    static getAvailabilityBadge(book) {
        const available = book.availableQty || book.available_qty || 0;
        const total = book.totalQty || book.total_qty || 1;

        if (available === 0) {
            return '<span class="availability-badge unavailable">Hết hàng</span>';
        } else if (available <= total * 0.2) {
            return '<span class="availability-badge low">Low Stock</span>';
        } else {
            return '<span class="availability-badge available">In Stock</span>';
        }
    }

    /**
     * Get category display name
     * @static
     * @param {Object} book - Book object
     * @returns {string} - Category name or empty string
     */
    static getCategoryDisplay(book) {
        if (!book) return '';

        // Direct category name
        if (typeof book.category === 'string') {
            return book.category;
        }

        // Category object with name property
        if (book.category && book.category.name) {
            return book.category.name;
        }

        // Category ID fallback
        if (book.category_id || book.categoryId) {
            return '';
        }

        return '';
    }

    /**
     * Escape HTML to prevent XSS
     * @static
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    static escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, (char) => map[char]);
    }
}
