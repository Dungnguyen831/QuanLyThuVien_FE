/**
 * AllBooksController
 * Manages the All Books page logic including:
 * - Fetching all books and categories
 * - Filtering by category
 * - Sorting books
 * - Availability filter
 * - Pagination
 */
class AllBooksController {
    constructor(model, view, wishlistModel = null) {
        this.model = model;
        this.view = view;
        this.wishlistModel = wishlistModel;

        // State management
        this.state = {
            allBooks: [],
            filteredBooks: [],
            categories: [],
            currentPage: 1,
            itemsPerPage: 12,
            activeCategory: "all",
            activeSort: "popularity",
            showAvailableOnly: false,
            wishlistBookIds: []
        };

        this.init();
    }

    /**
     * Initialize the controller
     */
    async init() {
        try {
            this.view.showLoading();

            // Bind wishlist model if available
            if (this.wishlistModel) {
                this.view.bindWishlistModel(this.wishlistModel);

                // Fetch wishlist IDs
                try {
                    const wishlistData = await this.wishlistModel.getWishlist();
                    this.state.wishlistBookIds = wishlistData && wishlistData.books
                        ? wishlistData.books.map(b => b.id)
                        : [];
                    this.view.bindWishlistBookIds(this.state.wishlistBookIds);
                } catch (error) {
                    console.warn('Could not load wishlist status:', error);
                }
            }

            // Fetch categories and books in parallel
            const [categories, books] = await Promise.all([
                this.model.fetchCategories(),
                this.model.fetchAllBooks()
            ]);

            console.log("Fetched categories:", categories);
            console.log("Fetched books:", books);

            if (!books || books.length === 0) {
                this.view.hideLoading();
                this.view.showError("No books found. Please try again later.");
                return;
            }

            this.state.categories = categories || [];
            this.state.allBooks = books;
            this.state.filteredBooks = [...this.state.allBooks];

            // Render categories sidebar
            this.view.renderCategories(this.state.categories);

            // Bind category click events
            this.bindCategoryEvents();

            // Bind filter and sort events
            this.bindControlEvents();

            // Render initial books
            await this.renderBooks();

        } catch (error) {
            console.error("Error initializing All Books:", error);
            this.view.hideLoading();
            this.view.showError("Unable to load books. Please try again later.");
        }
    }

    /**
     * Bind category click events
     */
    bindCategoryEvents() {
        this.view.onCategoryClick((categoryId) => {
            this.handleCategoryChange(categoryId);
        });
    }

    /**
     * Bind control events (sort, availability filter)
     */
    bindControlEvents() {
        this.view.onSortChange((sortValue) => {
            this.handleSortChange(sortValue);
        });

        this.view.onAvailabilityToggle((isChecked) => {
            this.handleAvailabilityToggle(isChecked);
        });

        this.view.onPaginationClick((pageNumber) => {
            this.handlePageChange(pageNumber);
        });

        this.view.onPaginationPrev(() => this.handlePaginationPrev());
        this.view.onPaginationNext(() => this.handlePaginationNext());
    }

    /**
     * Handle category change
     * @param {string|number} categoryId - Category ID or "all"
     */
    async handleCategoryChange(categoryId) {
        this.state.activeCategory = categoryId;
        this.state.currentPage = 1;

        // Filter books by category
        if (categoryId === "all") {
            this.state.filteredBooks = [...this.state.allBooks];
        } else {
            this.state.filteredBooks = this.state.allBooks.filter(
                book => book.category_id == categoryId
            );
        }

        // Apply current filters
        this.applyFiltersAndSort();
        await this.renderBooks();

        // Update active category in view
        this.view.setActiveCategory(categoryId);
    }

    /**
     * Handle sort change
     * @param {string} sortValue - Sort criteria (popularity, newest, rating)
     */
    async handleSortChange(sortValue) {
        this.state.activeSort = sortValue;
        this.state.currentPage = 1;

        this.applyFiltersAndSort();
        await this.renderBooks();
    }

    /**
     * Handle availability filter toggle
     * @param {boolean} isChecked - Whether to show only available books
     */
    async handleAvailabilityToggle(isChecked) {
        this.state.showAvailableOnly = isChecked;
        this.state.currentPage = 1;

        this.applyFiltersAndSort();
        await this.renderBooks();
    }

    /**
     * Handle page change
     * @param {number} pageNumber - Page number to navigate to
     */
    async handlePageChange(pageNumber) {
        this.state.currentPage = pageNumber;
        await this.renderBooks();
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
     * Apply filters and sorting to books
     */
    applyFiltersAndSort() {
        let filtered = [...this.state.filteredBooks];

        // Apply availability filter
        if (this.state.showAvailableOnly) {
            filtered = filtered.filter(book => book.availableQty > 0);
        }

        // Apply sorting
        switch (this.state.activeSort) {
            case "newest":
                filtered.sort((a, b) => {
                    const dateA = new Date(a.createdAt || 0);
                    const dateB = new Date(b.createdAt || 0);
                    return dateB - dateA;
                });
                break;

            case "rating":
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;

            case "popularity":
            default:
                filtered.sort((a, b) => (b.availableQty || 0) - (a.availableQty || 0));
                break;
        }

        this.state.filteredBooks = filtered;
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
     * Render books and pagination
     */
    async renderBooks() {
        const booksToDisplay = this.getBooksForCurrentPage();
        const totalPages = this.getTotalPages();

        // Render book cards
        await this.view.renderBooks(booksToDisplay, this.wishlistModel);

        // Render pagination
        this.view.renderPagination(totalPages, this.state.currentPage);

        // Update counter
        this.view.updateBooksCount(this.state.filteredBooks.length);

        this.view.hideLoading();
    }

    /**
     * Scroll to top of the page
     */
    scrollToTop() {
        window.scrollTo({
            top: 300,
            behavior: "smooth"
        });
    }
}
