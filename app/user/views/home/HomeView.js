class HomeView {
    constructor() {
        this.newArrivalsContainer = document.getElementById('new-arrivals-container');
        this.mostPopularContainer = document.getElementById('most-popular-container');
        this.loadingElement = document.getElementById('page-loading');
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'flex';
        }
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'none';
        }
    }

    /**
     * Show error message
     * @param {String} message - Error message to display
     */
    showError(message) {
        this.hideLoading();
        const errorHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert" style="margin: 20px; border-radius: 12px;">
                <i class="fas fa-exclamation-circle me-2"></i>
                <strong>Error:</strong> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        if (this.newArrivalsContainer) {
            this.newArrivalsContainer.innerHTML = errorHtml;
        }
    }

    /**
     * Render new arrivals section with book cards
     * @param {Array} books - Array of new arrival book objects
     */
    renderNewArrivals(books) {
        this.hideLoading();

        if (!this.newArrivalsContainer) {
            console.warn('New arrivals container not found');
            return;
        }

        if (!books || books.length === 0) {
            this.newArrivalsContainer.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px; display: block;"></i>
                    <p>No new arrivals at the moment.</p>
                </div>
            `;
            return;
        }

        this.newArrivalsContainer.innerHTML = '';
        books.forEach(book => {
            const bookCard = this.createBookCard(book);
            this.newArrivalsContainer.appendChild(bookCard);
        });
    }

    /**
     * Render most popular section with book cards
     * @param {Array} books - Array of most popular book objects
     */
    renderMostPopular(books) {
        if (!this.mostPopularContainer) {
            console.warn('Most popular container not found');
            return;
        }

        if (!books || books.length === 0) {
            this.mostPopularContainer.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-star" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px; display: block;"></i>
                    <p>No popular books at the moment.</p>
                </div>
            `;
            return;
        }

        this.mostPopularContainer.innerHTML = '';
        books.forEach(book => {
            const bookCard = this.createBookCard(book);
            this.mostPopularContainer.appendChild(bookCard);
        });
    }

    /**
     * Create a single book card element using reusable BookCard component
     * Handles image display, fallbacks, and badges
     * @param {Object} book - Book object from backend with: id, title, author_id, imageUrl, category_id, availableQty, totalQty
     * @returns {HTMLElement} - Book card DOM element (wrapped in column div)
     */
    createBookCard(book) {
        // ✅ Use reusable BookCard component with shared ImageService
        return BookCard.create(book, {
            showFavoriteBtn: true,
            onFavoriteClick: (bookData) => {
                // Trigger wishlist action if needed
                if (this.onFavoriteClick) {
                    this.onFavoriteClick(bookData);
                }
            },
            onCardClick: (bookData) => {
                // Trigger book details if needed
                if (this.onCardClick) {
                    this.onCardClick(bookData);
                }
            },
            imageField: 'imageUrl' // Use imageUrl from backend response
        });
    }

    /**
     * Bind favorite button click handler
     * @param {Function} callback - Callback function when favorite is clicked
     */
    bindFavoriteClick(callback) {
        this.onFavoriteClick = callback;
    }

    /**
     * Bind card click handler
     * @param {Function} callback - Callback function when card is clicked
     */
    bindCardClick(callback) {
        this.onCardClick = callback;
    }

    /**
     * [DEPRECATED] Generate availability badge - now handled by BookCard component
     * @private
     * @param {Number} availableQty - Available quantity
     * @param {Number} totalQty - Total quantity
     * @returns {String} - HTML string with availability badge
     */
    generateAvailabilityBadge(availableQty, totalQty) {
        const available = availableQty || 0;
        const total = totalQty || 1;

        if (available === 0) {
            return '<span class="availability-badge unavailable">Out of Stock</span>';
        } else if (available <= Math.ceil(total * 0.25)) {
            return '<span class="availability-badge low">Low Stock</span>';
        } else {
            return '<span class="availability-badge available">Available</span>';
        }
    }

    /**
     * Get author display name
     * Backend returns author_id only, not author name
     * @param {Number} author_id - Author ID from backend
     * @returns {String} - Author display text
     */
    getAuthorDisplay(author_id) {
        if (!author_id) return 'Unknown Author';
        return `Author #${author_id}`;
    }

    /**
     * Get category display name
     * Backend returns category_id only, not category name
     * @param {Number} category_id - Category ID from backend
     * @returns {String} - Category display text
     */
    getCategoryDisplay(category_id) {
        if (!category_id) return 'General';
        return `Category #${category_id}`;
    }

    /**
     * Escape HTML special characters to prevent XSS
     * @param {String} text - Text to escape
     * @returns {String} - Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }
}
