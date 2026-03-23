/**
 * Wishlist Controller Class
 * Handles business logic for the Wishlist page including:
 * - State management (current page, active filter, sort criteria)
 * - Fetching wishlist data from API
 * - Filtering and sorting operations
 * - Pagination logic
 */
class WishlistController {
    constructor(wishlistModel, wishlistView) {
        this.model = wishlistModel;
        this.view = wishlistView;

        // State management
        this.state = {
            allBooks: [],
            filteredBooks: [],
            currentPage: 1,
            itemsPerPage: 6,
            activeFilter: 'all',
            sortBy: 'date-added'
        };

        this.init();
    }

    /**
     * Initialize the controller and bind all events
     */
    init() {
        this.bindViewEvents();
        this.loadWishlistData();
    }

    /**
     * Bind all view events to controller methods
     */
    bindViewEvents() {
        this.view.onFilterChange((filterValue) => this.handleFilterChange(filterValue));
        this.view.onSortChange((sortValue) => this.handleSortChange(sortValue));
        this.view.onPaginationClick((pageNumber) => this.handlePageChange(pageNumber));
        this.view.onPaginationPrev(() => this.handlePaginationPrev());
        this.view.onPaginationNext(() => this.handlePaginationNext());
        this.view.onHeartIconClick((bookId, btn) => this.handleRemoveFromWishlist(bookId, btn));
        this.view.onBorrowAll(() => this.handleBorrowAll());
    }

    /**
     * Load wishlist data from model
     */
    async loadWishlistData() {
        try {
            this.view.showLoading();
            const data = await this.model.getWishlist();

            if (data && data.books) {
                this.state.allBooks = data.books;
                this.state.filteredBooks = [...this.state.allBooks];
                this.state.currentPage = 1;

                this.view.updateItemsCounter(this.state.filteredBooks.length);
                this.applyFilterAndSort();
                this.renderPage();
            } else {
                this.view.showError('Unable to load wishlist data');
            }
        } catch (error) {
            console.error('Error loading wishlist:', error);
            this.view.showError('Error loading your wishlist. Please try again later.');
        }
    }

    /**
     * Handle filter change event
     * @param {string} filterValue - The filter to apply
     */
    handleFilterChange(filterValue) {
        this.state.activeFilter = filterValue;
        this.state.currentPage = 1;
        this.applyFilterAndSort();
        this.renderPage();
    }

    /**
     * Handle sort change event
     * @param {string} sortValue - The sort criteria to apply
     */
    handleSortChange(sortValue) {
        this.state.sortBy = sortValue;
        this.state.currentPage = 1;
        this.applyFilterAndSort();
        this.renderPage();
    }

    /**
     * Handle page change from pagination
     * @param {number} pageNumber - Page number to navigate to
     */
    handlePageChange(pageNumber) {
        this.state.currentPage = pageNumber;
        this.renderPage();
        this.scrollToTop();
    }

    /**
     * Handle previous pagination button
     */
    handlePaginationPrev() {
        if (this.state.currentPage > 1) {
            this.handlePageChange(this.state.currentPage - 1);
        }
    }

    /**
     * Handle next pagination button
     */
    handlePaginationNext() {
        const totalPages = this.getTotalPages();
        if (this.state.currentPage < totalPages) {
            this.handlePageChange(this.state.currentPage + 1);
        }
    }

    /**
     * Handle removing book from wishlist
     * @param {string|number} bookId - ID of the book to remove
     * @param {Element} btn - Heart button element
     */
    async handleRemoveFromWishlist(bookId, btn) {
        try {
            await this.model.removeFromWishlist(bookId);

            // Remove book from local state
            this.state.allBooks = this.state.allBooks.filter(book => book.id !== bookId);
            this.state.filteredBooks = this.state.filteredBooks.filter(book => book.id !== bookId);

            // Reset to page 1 if current page is now empty
            const totalPages = this.getTotalPages();
            if (this.state.currentPage > totalPages) {
                this.state.currentPage = Math.max(1, totalPages);
            }

            this.view.updateItemsCounter(this.state.filteredBooks.length);
            this.renderPage();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            alert('Failed to remove book from wishlist');
        }
    }

    /**
     * Handle borrow all available books
     */
    async handleBorrowAll() {
        try {
            const availableBooks = this.state.filteredBooks.filter(book => book.availability === 'available');

            if (availableBooks.length === 0) {
                alert('No available books to borrow');
                return;
            }

            const bookIds = availableBooks.map(book => book.id);
            await this.model.borrowBooks(bookIds);

            alert(`Successfully borrowed ${bookIds.length} book(s)`);
            this.loadWishlistData(); // Reload to update availability status
        } catch (error) {
            console.error('Error borrowing books:', error);
            alert('Failed to borrow books');
        }
    }

    /**
     * Apply current filter and sort to the books
     */
    applyFilterAndSort() {
        // Apply filter
        this.state.filteredBooks = this._applyFilter(this.state.allBooks, this.state.activeFilter);

        // Apply sort
        this.state.filteredBooks = this._applySorting(this.state.filteredBooks, this.state.sortBy);
    }

    /**
     * Apply filter to books array
     * @private
     * @param {Array} books - Books to filter
     * @param {string} filter - Filter type
     * @returns {Array} Filtered books
     */
    _applyFilter(books, filter) {
        if (filter === 'all') {
            return books;
        }

        return books.filter(book => {
            switch (filter) {
                case 'available':
                    return book.availability === 'available';
                case 'ebooks':
                    return book.format === 'ebook';
                case 'audiobooks':
                    return book.format === 'audiobook';
                default:
                    return true;
            }
        });
    }

    /**
     * Apply sorting to books array
     * @private
     * @param {Array} books - Books to sort
     * @param {string} sortBy - Sort criteria
     * @returns {Array} Sorted books
     */
    _applySorting(books, sortBy) {
        const sorted = [...books];

        switch (sortBy) {
            case 'date-added':
                sorted.sort((a, b) => {
                    const dateA = new Date(a.dateAdded || 0);
                    const dateB = new Date(b.dateAdded || 0);
                    return dateB - dateA; // Most recent first
                });
                break;

            case 'title':
                sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
                break;

            case 'author':
                sorted.sort((a, b) => (a.author || '').localeCompare(b.author || ''));
                break;

            case 'rating':
                sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;

            default:
                // Default to date added
                sorted.sort((a, b) => {
                    const dateA = new Date(a.dateAdded || 0);
                    const dateB = new Date(b.dateAdded || 0);
                    return dateB - dateA;
                });
        }

        return sorted;
    }

    /**
     * Get total number of pages
     * @returns {number} Total pages
     */
    getTotalPages() {
        return Math.ceil(this.state.filteredBooks.length / this.state.itemsPerPage);
    }

    /**
     * Get books for current page
     * @returns {Array} Books to display on current page
     */
    getBooksForCurrentPage() {
        const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
        const endIndex = startIndex + this.state.itemsPerPage;
        return this.state.filteredBooks.slice(startIndex, endIndex);
    }

    /**
     * Render the current page
     */
    renderPage() {
        const booksToDisplay = this.getBooksForCurrentPage();
        const totalPages = this.getTotalPages();

        this.view.renderWishlistBooks(booksToDisplay);
        this.view.renderPagination(totalPages, this.state.currentPage);
    }

    /**
     * Scroll to top of the page
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
}