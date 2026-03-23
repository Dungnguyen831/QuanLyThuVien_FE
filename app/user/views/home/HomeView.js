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
     * Create a single book card element
     * @param {Object} book - Book object from backend with: id, title, author_id, imageUri, category_id, availableQty, totalQty
     * @returns {HTMLElement} - Book card DOM element
     */
    createBookCard(book) {
        const col = document.createElement('div');
        col.className = 'col-12 col-sm-6 col-md-4 col-lg-2';

        // Generate availability badge (backend doesn't have rating)
        const availabilityBadge = this.generateAvailabilityBadge(book.availableQty, book.totalQty);

        // Create book card
        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
            <div class="book-card-image-wrapper">
                <img 
                    src="${book.imageUri || 'https://via.placeholder.com/150x225?text=No+Cover'}" 
                    alt="${this.escapeHtml(book.title)}" 
                    class="book-card-image"
                    onerror="this.src='https://via.placeholder.com/150x225?text=No+Cover'"
                >
                <button class="book-card-favorite-btn" title="Add to favorites">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="book-card-content">
                <h4 class="book-card-title">${this.escapeHtml(book.title || 'Unknown Title')}</h4>
                <p class="book-card-author">${this.getAuthorDisplay(book.author_id)}</p>
                <div class="book-card-rating">
                    ${availabilityBadge}
                </div>
                <p class="book-card-category">${this.getCategoryDisplay(book.category_id)}</p>
            </div>
        `;

        col.appendChild(card);
        return col;
    }

    /**
     * Generate availability badge HTML (replaces rating since backend doesn't have it)
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
