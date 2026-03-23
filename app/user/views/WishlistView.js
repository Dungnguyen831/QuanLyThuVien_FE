/**
 * Wishlist View Class
 * Handles all rendering logic for the Wishlist page including:
 * - Book cards display
 * - Filter pills and sort dropdown binding
 * - Pagination rendering
 * - Dynamic content updates
 */
class WishlistView {
    constructor() {
        this.wishlistGrid = document.getElementById('wishlist-grid');
        this.wishlistSubtitle = document.getElementById('wishlist-subtitle');
        this.borrowAllBtn = document.getElementById('borrow-all-btn');
        this.filterPills = document.querySelectorAll('.filter-pill');
        this.sortDropdown = document.getElementById('sort-dropdown');
        this.paginationNumbers = document.getElementById('pagination-numbers');
        this.paginationPrev = document.getElementById('pagination-prev');
        this.paginationNext = document.getElementById('pagination-next');

        this.eventListeners = {};
    }

    /**
     * Render wishlist books as a grid of cards
     * @param {Array} books - Array of book objects to render
     */
    renderWishlistBooks(books) {
        if (!books || books.length === 0) {
            this.wishlistGrid.innerHTML = '<div class="empty-state">No books in your wishlist yet.</div>';
            return;
        }

        this.wishlistGrid.innerHTML = books.map(book => this._createBookCard(book)).join('');
    }

    /**
     * Create individual book card HTML
     * @private
     * @param {Object} book - Book object with properties: id, title, author, cover, rating, inWishlist
     * @returns {string} HTML string for book card
     */
    _createBookCard(book) {
        const starRating = this._generateStarRating(book.rating);
        const reviewCount = book.reviewCount || 0;

        return `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-cover-container">
                    <img src="${book.cover}" alt="${book.title}" class="book-cover">
                    <button class="heart-icon active" data-book-id="${book.id}" title="Remove from wishlist">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </button>
                </div>
                <div class="book-info">
                    <h3 class="book-title">${this._escapeHtml(book.title)}</h3>
                    <p class="book-author">${this._escapeHtml(book.author)}</p>
                    <div class="book-rating">
                        ${starRating}
                        <span class="rating-count">(${reviewCount})</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Generate star rating HTML
     * @private
     * @param {number} rating - Rating value (0-5)
     * @returns {string} HTML string with stars
     */
    _generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<span class="star full">★</span>';
        }

        if (hasHalfStar) {
            stars += '<span class="star half">★</span>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<span class="star empty">★</span>';
        }

        return stars;
    }

    /**
     * Escape HTML special characters to prevent XSS
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Update the wishlist items counter subtitle
     * @param {number} count - Total number of items in wishlist
     */
    updateItemsCounter(count) {
        const itemText = count === 1 ? 'item' : 'items';
        this.wishlistSubtitle.textContent = `You have ${count} ${itemText} saved for later exploration.`;
    }

    /**
     * Render pagination buttons
     * @param {number} totalPages - Total number of pages
     * @param {number} currentPage - Current active page (1-based)
     */
    renderPagination(totalPages, currentPage) {
        this.paginationNumbers.innerHTML = '';

        // Always show page 1
        this._createPageButton(1, currentPage === 1);

        // Show ellipsis and middle pages if needed
        if (totalPages > 1) {
            if (currentPage > 3) {
                this._createEllipsis();
            }

            // Show pages around current page
            const startPage = Math.max(2, currentPage - 1);
            const endPage = Math.min(totalPages - 1, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                this._createPageButton(i, currentPage === i);
            }

            if (currentPage < totalPages - 2) {
                this._createEllipsis();
            }

            // Always show last page if more than 1 page
            if (totalPages > 1) {
                this._createPageButton(totalPages, currentPage === totalPages);
            }
        }

        // Update previous/next button states
        this.paginationPrev.disabled = currentPage === 1;
        this.paginationNext.disabled = currentPage === totalPages;
    }

    /**
     * Create a single pagination page button
     * @private
     * @param {number} pageNumber - Page number
     * @param {boolean} isActive - Whether this page is currently active
     */
    _createPageButton(pageNumber, isActive) {
        const button = document.createElement('button');
        button.className = `pagination-number ${isActive ? 'active' : ''}`;
        button.textContent = pageNumber;
        button.dataset.page = pageNumber;
        button.disabled = isActive;

        this.paginationNumbers.appendChild(button);
    }

    /**
     * Create ellipsis separator in pagination
     * @private
     */
    _createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        this.paginationNumbers.appendChild(ellipsis);
    }

    /**
     * Set active filter pill
     * @param {string} filterValue - The filter value to activate
     */
    setActiveFilter(filterValue) {
        this.filterPills.forEach(pill => {
            if (pill.dataset.filter === filterValue) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    /**
     * Get current active filter
     * @returns {string} Active filter value
     */
    getActiveFilter() {
        const activePill = document.querySelector('.filter-pill.active');
        return activePill ? activePill.dataset.filter : 'all';
    }

    /**
     * Get current sort value
     * @returns {string} Current sort dropdown value
     */
    getSortValue() {
        return this.sortDropdown.value;
    }

    /**
     * Bind filter pill click events
     * @param {Function} callback - Callback function when filter changes
     */
    onFilterChange(callback) {
        this.eventListeners.filterChange = callback;
        this.filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                this.setActiveFilter(pill.dataset.filter);
                callback(pill.dataset.filter);
            });
        });
    }

    /**
     * Bind sort dropdown change events
     * @param {Function} callback - Callback function when sort changes
     */
    onSortChange(callback) {
        this.eventListeners.sortChange = callback;
        this.sortDropdown.addEventListener('change', (e) => {
            callback(e.target.value);
        });
    }

    /**
     * Bind pagination page button clicks
     * @param {Function} callback - Callback function with page number
     */
    onPaginationClick(callback) {
        this.eventListeners.paginationClick = callback;
        this.paginationNumbers.addEventListener('click', (e) => {
            if (e.target.classList.contains('pagination-number')) {
                callback(parseInt(e.target.dataset.page, 10));
            }
        });
    }

    /**
     * Bind previous pagination button
     * @param {Function} callback - Callback function when prev is clicked
     */
    onPaginationPrev(callback) {
        this.eventListeners.paginationPrev = callback;
        this.paginationPrev.addEventListener('click', callback);
    }

    /**
     * Bind next pagination button
     * @param {Function} callback - Callback function when next is clicked
     */
    onPaginationNext(callback) {
        this.eventListeners.paginationNext = callback;
        this.paginationNext.addEventListener('click', callback);
    }

    /**
     * Bind heart icon (wishlist) click events
     * @param {Function} callback - Callback function with book id
     */
    onHeartIconClick(callback) {
        this.eventListeners.heartIconClick = callback;
        this.wishlistGrid.addEventListener('click', (e) => {
            const heartBtn = e.target.closest('.heart-icon');
            if (heartBtn) {
                const bookId = heartBtn.dataset.bookId;
                callback(bookId, heartBtn);
            }
        });
    }

    /**
     * Bind borrow all button
     * @param {Function} callback - Callback function when borrow all is clicked
     */
    onBorrowAll(callback) {
        this.eventListeners.borrowAll = callback;
        this.borrowAllBtn.addEventListener('click', callback);
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.wishlistGrid.innerHTML = '<div class="loading-state">Loading your wishlist...</div>';
    }

    /**
     * Show error state
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.wishlistGrid.innerHTML = `<div class="error-state">${this._escapeHtml(message)}</div>`;
    }
}