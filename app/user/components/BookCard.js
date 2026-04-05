/**
 * Reusable BookCard Component
 * Renders a book card with image, title, author, and optional actions
 * Works across Home, Reservation, and Wishlist pages
 * 
 * Features:
 * - Responsive image with object-fit: cover
 * - Default placeholder for missing images
 * - Flexible data field names (imageUri, cover, imageUrl)
 * - Optional favorite button
 * - Configurable callbacks for actions
 */
class BookCard {
    /**
     * Create a book card element
     * @param {Object} book - Book data object
     * @param {Object} options - Configuration options
     * @param {boolean} options.showFavoriteBtn - Show/hide favorite button (default: false)
     * @param {Function} options.onFavoriteClick - Callback for favorite button click
     * @param {Function} options.onCardClick - Callback for card click
     * @param {string} options.imageField - Which field contains image URL (auto-detect if not specified)
     * @returns {HTMLElement} - Book card DOM element
     */
    static create(book, options = {}) {
        const {
            showFavoriteBtn = false,
            onFavoriteClick = null,
            onCardClick = null,
            imageField = null
        } = options;

        // Create wrapper column
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-2';
        col.dataset.bookId = book.id;

        // Get image URL from flexible field names
        const imageUrl = BookCard._getImageUrl(book, imageField);
        const defaultImage = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22 fill=%22%23999%22 font-family=%22Arial%22%3ENo Cover%3C/text%3E%3C/svg%3E';

        // Create card
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-card-image-wrapper">
                <img 
                    src="${BookCard._escapeHtml(imageUrl)}" 
                    alt="${BookCard._escapeHtml(book.title || 'Book')}" 
                    class="book-card-image"
                    loading="lazy"
                    onerror="this.src='${defaultImage}'"
                >
                ${showFavoriteBtn ? `
                    <button class="book-card-favorite-btn" title="Add to favorites" data-book-id="${book.id}">
                        <i class="far fa-heart"></i>
                    </button>
                ` : ''}
            </div>
            <div class="book-card-content">
                <h4 class="book-card-title">${BookCard._escapeHtml(book.title || 'Unknown Title')}</h4>
                <p class="book-card-author">${BookCard._getAuthorDisplay(book)}</p>
                <div class="book-card-rating">
                    ${BookCard._getAvailabilityBadge(book)}
                </div>
                <p class="book-card-category">${BookCard._getCategoryDisplay(book)}</p>
            </div>
        `;

        // Add click handlers
        if (onCardClick) {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.book-card-favorite-btn')) {
                    onCardClick(book);
                }
            });
            card.style.cursor = 'pointer';
        }

        if (showFavoriteBtn && onFavoriteClick) {
            const favoriteBtn = card.querySelector('.book-card-favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    onFavoriteClick(book);
                });
            }
        }

        col.appendChild(card);
        return col;
    }

    /**
     * Get image URL from flexible field names with proper path resolution
     * Uses ImageService if available, otherwise handles path resolution manually
     * Tries: imageUrl → cover → imageUri → image → thumb (in order)
     * @private
     * @param {Object} book - Book object
     * @param {string} fieldName - Specific field name to use
     * @returns {string} - Image URL or placeholder SVG
     */
    static _getImageUrl(book, fieldName) {
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
                console.warn('ImageService error, falling back to manual resolution:', error);
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
        const backendUrl = BookCard._getApiBaseUrl();
        if (backendUrl) {
            return `${backendUrl}/api/v1/images/${encodeURIComponent(imagePath)}`;
        }

        // ✅ Fallback: local assets folder
        return `/assets/img/${encodeURIComponent(imagePath)}`;
    }

    /**
     * Get API base URL based on current environment
     * @private
     * @returns {string} - API base URL (without /api/v1)
     */
    static _getApiBaseUrl() {
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
     * @private
     * @param {Object} book - Book object
     * @returns {string} - Author name or "Unknown Author"
     */
    static _getAuthorDisplay(book) {
        if (!book) return 'Unknown Author';

        // Direct author name
        if (typeof book.author === 'string') {
            return book.author;
        }

        // Author object with name property
        if (book.author && book.author.name) {
            return book.author.name;
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
     * @private
     * @param {Object} book - Book object
     * @returns {string} - HTML badge string
     */
    static _getAvailabilityBadge(book) {
        const available = book.availableQty || book.available_qty || 0;
        const total = book.totalQty || book.total_qty || 1;

        if (available === 0) {
            return '<span class="availability-badge unavailable">Out of Stock</span>';
        } else if (available <= total * 0.2) {
            return '<span class="availability-badge low">Low Stock</span>';
        } else {
            return '<span class="availability-badge available">In Stock</span>';
        }
    }

    /**
     * Get category display name
     * @private
     * @param {Object} book - Book object
     * @returns {string} - Category name or empty string
     */
    static _getCategoryDisplay(book) {
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
     * @private
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    static _escapeHtml(text) {
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
