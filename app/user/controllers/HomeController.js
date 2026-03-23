/**
 * HomeController
 * Handles data fetching for the user homepage
 * Fetches "New Arrivals" and "Most Popular" book sections
 */
class HomeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    /**
     * Initialize the homepage
     * Fetch and render book data for both sections
     */
    async init() {
        try {
            this.view.showLoading();

            // Fetch all books from the model
            const books = await this.model.fetchBooks();

            // Process data for different sections
            const newArrivals = this.getNewArrivals(books, 6);
            const mostPopular = this.getMostPopular(books, 6);

            // Render sections with the processed data
            this.view.renderNewArrivals(newArrivals);
            this.view.renderMostPopular(mostPopular);

        } catch (error) {
            console.error("Lỗi ở HomeController:", error);
            this.view.showError("Unable to load books. Please try again later.");
        }
    }

    /**
     * Get new arrivals by sorting books by creation date (descending)
     * @param {Array} books - Array of book objects
     * @param {Number} limit - Number of books to return
     * @returns {Array} - Array of new arrival books
     */
    getNewArrivals(books, limit = 6) {
        if (!books || books.length === 0) return [];

        return books
            .sort((a, b) => {
                // Sort by createdAt (backend field) - most recent first
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA;
            })
            .slice(0, limit);
    }

    /**
     * Get most popular books by sorting by availability (descending)
     * Since backend doesn't have rating field, sort by availableQty as proxy for popularity
     * @param {Array} books - Array of book objects
     * @param {Number} limit - Number of books to return
     * @returns {Array} - Array of most popular books
     */
    getMostPopular(books, limit = 6) {
        if (!books || books.length === 0) return [];

        return books
            .sort((a, b) => {
                // Sort by availableQty (most available first)
                const qtyA = a.availableQty || 0;
                const qtyB = b.availableQty || 0;
                return qtyB - qtyA;
            })
            .slice(0, limit);
    }
}
