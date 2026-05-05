/**
 * AllBooksView
 * Handles rendering of the All Books page
 * Manages:
 * - Category sidebar
 * - Book grid
 * - Filters and sorting controls
 * - Pagination
 */
class AllBooksView {
    constructor() {
        this.booksContainer = document.getElementById('all-books-grid');
        this.categoriesSidebar = document.getElementById('categories-sidebar');
        this.sortDropdown = document.getElementById('sort-dropdown');
        this.availabilityToggle = document.getElementById('availability-toggle');
        this.loadingElement = document.getElementById('page-loading');
        this.booksCountElement = document.getElementById('books-count');
        this.paginationNumbers = document.getElementById('pagination-numbers');
        this.paginationPrev = document.getElementById('pagination-prev');
        this.paginationNext = document.getElementById('pagination-next');
        this.wishlistModel = null;
        this.wishlistBookIds = [];
        this.eventListeners = {};

        // Log for debugging
        console.log("AllBooksView khởi tạo với các phần tử:");
        console.log("- booksContainer:", this.booksContainer);
        console.log("- categoriesSidebar:", this.categoriesSidebar);
        console.log("- sortDropdown:", this.sortDropdown);
        console.log("- availabilityToggle:", this.availabilityToggle);
        console.log("- loadingElement:", this.loadingElement);
        console.log("- paginationNumbers:", this.paginationNumbers);
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
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.hideLoading();
        const errorHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-circle me-2"></i>
                <strong>Lỗi:</strong> ${this.escapeHtml(message)}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        if (this.booksContainer) {
            this.booksContainer.innerHTML = errorHtml;
        }
    }

    /**
     * Render categories in sidebar
     * @param {Array} categories - Array of category objects
     */
    renderCategories(categories) {
        if (!this.categoriesSidebar) {
            console.warn('Không tìm thấy sidebar danh mục');
            return;
        }

        this.categoriesSidebar.innerHTML = '';

        // Add "All Books" category
        const allBooksBtn = document.createElement('button');
        allBooksBtn.className = 'category-btn active';
        allBooksBtn.dataset.categoryId = 'all';
        allBooksBtn.innerHTML = '<i class="fas fa-book"></i> All Books';
        this.categoriesSidebar.appendChild(allBooksBtn);

        // Add category buttons
        if (categories && categories.length > 0) {
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = 'category-btn';
                btn.dataset.categoryId = category.id;
                btn.innerHTML = `<i class="fas fa-folder"></i> ${this.escapeHtml(category.name || 'Unknown')}`;
                this.categoriesSidebar.appendChild(btn);
            });
        }
    }

    /**
     * Set active category button
     * @param {string|number} categoryId - Category ID or "all"
     */
    setActiveCategory(categoryId) {
        const buttons = this.categoriesSidebar.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            if (btn.dataset.categoryId == categoryId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Render books as grid
     * @param {Array} books - Array of book objects to render
     * @param {Object} wishlistModel - WishlistModel instance
     */
    async renderBooks(books, wishlistModel = null) {
        if (!this.booksContainer) {
            console.warn('Không tìm thấy vùng chứa sách');
            return;
        }

        if (!books || books.length === 0) {
            this.booksContainer.innerHTML = `
                <div class="col-12 text-center text-muted py-5">
                    <i class="fas fa-inbox" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px; display: block;"></i>
                    <p>Không tìm thấy sách.</p>
                </div>
            `;
            return;
        }

        this.booksContainer.innerHTML = '';

        // Create all book cards in parallel
        const bookCards = await Promise.all(
            books.map(book => this.createBookCard(book, wishlistModel))
        );

        // Append to container
        bookCards.forEach(card => {
            this.booksContainer.appendChild(card);
        });
    }

    /**
     * Create a book card using BookCard component
     * @private
     * @param {Object} book - Book object
     * @param {Object} wishlistModel - WishlistModel instance
     * @returns {Promise<HTMLElement>} Book card element
     */
    async createBookCard(book, wishlistModel = null) {
        const isInWishlist = this.wishlistBookIds.includes(book.id);

        return BookCard.create(book, {
            showFavoriteBtn: true,
            imageField: 'imageUrl',
            wishlistModel: this.wishlistModel || wishlistModel,
            isInWishlist: isInWishlist,
            onCardClick: (bookData) => {
                // Navigate to book details
                window.location.href = `../book/book_detail.html?id=${bookData.id}`;
            },
            onWishlistChange: (bookData, inWishlist) => {
                // Update wishlist state
                if (inWishlist && !this.wishlistBookIds.includes(bookData.id)) {
                    this.wishlistBookIds.push(bookData.id);
                } else if (!inWishlist && this.wishlistBookIds.includes(bookData.id)) {
                    this.wishlistBookIds = this.wishlistBookIds.filter(id => id !== bookData.id);
                }
            }
        });
    }

    /**
     * Render pagination buttons
     * @param {number} totalPages - Total number of pages
     * @param {number} currentPage - Current active page
     */
    renderPagination(totalPages, currentPage) {
        if (!this.paginationNumbers) return;

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

        // Update prev/next button states
        if (this.paginationPrev) this.paginationPrev.disabled = currentPage === 1;
        if (this.paginationNext) this.paginationNext.disabled = currentPage === totalPages;
    }

    /**
     * Create pagination button
     * @private
     * @param {number} pageNumber - Page number
     * @param {boolean} isActive - Whether button is active
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
     * Create pagination ellipsis
     * @private
     */
    _createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        this.paginationNumbers.appendChild(ellipsis);
    }

    /**
     * Update books count
     * @param {number} count - Total books count
     */
    updateBooksCount(count) {
        if (this.booksCountElement) {
            this.booksCountElement.textContent = `${count} ${count === 1 ? 'book' : 'books'}`;
        }
    }

    /**
     * Bind category click events
     * @param {Function} callback - Callback function
     */
    onCategoryClick(callback) {
        this.eventListeners.categoryClick = callback;
        if (this.categoriesSidebar) {
            this.categoriesSidebar.addEventListener('click', (e) => {
                const btn = e.target.closest('.category-btn');
                if (btn) {
                    callback(btn.dataset.categoryId);
                }
            });
        }
    }

    /**
     * Bind sort dropdown change
     * @param {Function} callback - Callback function
     */
    onSortChange(callback) {
        this.eventListeners.sortChange = callback;
        if (this.sortDropdown) {
            this.sortDropdown.addEventListener('change', (e) => {
                callback(e.target.value);
            });
        }
    }

    /**
     * Bind availability toggle
     * @param {Function} callback - Callback function
     */
    onAvailabilityToggle(callback) {
        this.eventListeners.availabilityToggle = callback;
        if (this.availabilityToggle) {
            this.availabilityToggle.addEventListener('change', (e) => {
                callback(e.target.checked);
            });
        }
    }

    /**
     * Bind pagination clicks
     * @param {Function} callback - Callback function
     */
    onPaginationClick(callback) {
        this.eventListeners.paginationClick = callback;
        if (this.paginationNumbers) {
            this.paginationNumbers.addEventListener('click', (e) => {
                if (e.target.classList.contains('pagination-number')) {
                    callback(parseInt(e.target.dataset.page, 10));
                }
            });
        }
    }

    /**
     * Bind pagination prev button
     * @param {Function} callback - Callback function
     */
    onPaginationPrev(callback) {
        this.eventListeners.paginationPrev = callback;
        if (this.paginationPrev) {
            this.paginationPrev.addEventListener('click', callback);
        }
    }

    /**
     * Bind pagination next button
     * @param {Function} callback - Callback function
     */
    onPaginationNext(callback) {
        this.eventListeners.paginationNext = callback;
        if (this.paginationNext) {
            this.paginationNext.addEventListener('click', callback);
        }
    }

    /**
     * Bind wishlist model
     * @param {Object} wishlistModel - WishlistModel instance
     */
    bindWishlistModel(wishlistModel) {
        this.wishlistModel = wishlistModel;
    }

    /**
     * Bind wishlist book IDs
     * @param {Array} wishlistBookIds - Array of book IDs in wishlist
     */
    bindWishlistBookIds(wishlistBookIds) {
        this.wishlistBookIds = wishlistBookIds || [];
    }

    /**
     * Escape HTML special characters
     * @private
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, m => map[m]);
    }
}
