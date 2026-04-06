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

        this.newArrivalsContainer.innerHTML = books
        .map(book => this.createBookCard(book))
        .join('');
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

        this.mostPopularContainer.innerHTML = books
        .map(book => this.createBookCard(book))
        .join('');
    }

    /**
     * Create a single book card element
     * @param {Object} book - Book object from backend with: id, title, author_id, imageUri, category_id, availableQty, totalQty
     * @returns {HTMLElement} - Book card DOM element
     */
    createBookCard(book) {
    // SỬA ĐOẠN NÀY: Dùng đường dẫn từ gốc "/"
    const imgPath = book.imageUrl 
        ? `/assets/images/${book.imageUrl.split('/').pop()}` 
        : "/assets/images/default-book.png";

    const safeTitle = this.escapeHtml(book.title || 'No Title');
    const badgeHtml = this.generateAvailabilityBadge(book.availableQty, book.totalQty);

    return `
        <div class="book-card" onclick="window.location.href='../book/book_detail.html?id=${book.id}'">
            <div class="book-card-image">
                <img src="${imgPath}" 
                     alt="${safeTitle}" 
                     onerror="this.onerror=null; this.src='/assets/images/default-book.png';">
                <div class="book-badge-container">${badgeHtml}</div>
            </div>
            <div class="book-card-info">
                <h3 class="book-card-title">${safeTitle}</h3>
                <p class="book-card-author">${this.getAuthorDisplay(book.author_id)}</p>
                <div class="book-card-footer">
                    <span class="book-card-year">${book.publishedYear || 'N/A'}</span>
                    <div class="book-card-rating">★ 4.8</div>
                </div>
            </div>
        </div>
    `;
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
