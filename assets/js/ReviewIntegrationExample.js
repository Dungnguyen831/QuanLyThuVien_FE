/**
 * ReviewIntegrationExample.js
 * 
 * Example of how to integrate the Review feature into your book detail page.
 * This file shows the recommended way to set up and initialize the review system.
 * 
 * Usage:
 * 1. Copy the relevant parts to your book detail controller/view
 * 2. Adjust selectors and IDs to match your HTML structure
 * 3. Ensure all review files are loaded before this code runs
 */

/**
 * Initialize Review Feature for Book Detail Page
 * Call this function when the book detail page loads
 */
async function initializeReviewFeature() {
    // Step 1: Validate that Review classes are available
    if (typeof ReviewController === 'undefined') {
        console.error('ReviewController class not found. Make sure ReviewController.js is loaded.');
        return;
    }

    if (typeof ReviewView === 'undefined') {
        console.error('ReviewView class not found. Make sure ReviewView.js is loaded.');
        return;
    }

    if (typeof ReviewModel === 'undefined') {
        console.error('ReviewModel class not found. Make sure ReviewModel.js is loaded.');
        return;
    }

    // Step 2: Get book ID
    const bookId = getCurrentBookIdFromPage();
    if (!bookId) {
        console.error('Book ID not found. Make sure getCurrentBookIdFromPage() returns valid ID.');
        return;
    }

    console.log('Initializing review feature for book ID:', bookId);

    // Step 3: Create global review controller instance
    window.reviewController = new ReviewController();

    // Step 4: Get add review button and set up initial state
    const addReviewBtn = document.getElementById('addReviewBtn');
    if (addReviewBtn) {
        const token = localStorage.getItem('token');
        if (!token) {
            addReviewBtn.disabled = true;
            addReviewBtn.title = 'Vui lòng đăng nhập để viết đánh giá';
        }

        // Attach click event listener
        addReviewBtn.addEventListener('click', handleAddReviewClick);
    } else {
        console.warn('Add review button not found. Make sure review.html is loaded.');
    }

    // Step 5: Load reviews
    try {
        await window.reviewController.init(bookId);
        console.log('Review feature initialized successfully');
    } catch (error) {
        console.error('Error initializing review feature:', error);
    }
}

/**
 * Handle add review button click
 * Users must be logged in to add a review
 */
function handleAddReviewClick() {
    if (!localStorage.getItem('token')) {
        alert('Vui lòng đăng nhập để viết đánh giá');
        // Optionally redirect to login page
        // window.location.href = '/login';
        return;
    }

    // Check if controller is available
    if (!window.reviewController) {
        console.error('Review controller not initialized');
        return;
    }

    window.reviewController.handleAddReviewClick();
}

/**
 * Alternative: Using fetch to load review.html dynamically
 * Use this if you want to load the review section dynamically
 */
async function loadReviewSectionDynamically(containerId = 'reviewContainer') {
    try {
        const response = await fetch('app/user/views/review/review.html');
        if (!response.ok) {
            throw new Error('Failed to load review.html');
        }

        const html = await response.text();
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = html;
            console.log('Review section loaded successfully');
        } else {
            console.error(`Container with ID '${containerId}' not found`);
        }
    } catch (error) {
        console.error('Error loading review section:', error);
    }
}

/**
 * Display review statistics on the page
 * Shows average rating and review count
 */
async function displayReviewStatistics(bookId, containerId = 'reviewStats') {
    try {
        const reviewModel = new ReviewModel();
        const allReviews = await reviewModel.getAllReviews();
        const bookReviews = allReviews.filter(r => r.bookId == bookId);

        const avgRating = calculateAverageRating(bookReviews);
        const ratingCounts = countReviewsByRating(bookReviews);

        const statsHTML = `
            <div class="review-stats">
                <div class="stat-item">
                    <span class="stat-label">Đánh giá trung bình:</span>
                    <span class="stat-value">${avgRating}⭐</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">Tổng số đánh giá:</span>
                    <span class="stat-value">${bookReviews.length}</span>
                </div>
                <div class="rating-breakdown">
                    ${[5, 4, 3, 2, 1].map(rating => `
                        <div class="rating-bar">
                            <span>${rating}⭐</span>
                            <progress value="${ratingCounts[rating]}" max="${bookReviews.length || 1}"></progress>
                            <span>${ratingCounts[rating]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        const statsContainer = document.getElementById(containerId);
        if (statsContainer) {
            statsContainer.innerHTML = statsHTML;
        }
    } catch (error) {
        console.error('Error displaying review statistics:', error);
    }
}

/**
 * Example: How to use in your HTML
 * 
 * In your book detail page (bookdetail.html):
 * 
 * <html>
 * <head>
 *     <link rel="stylesheet" href="assets/css/user/review.css">
 * </head>
 * <body>
 *     <div id="bookDetail" data-book-id="123">
 *         <!-- Book details here -->
 *     </div>
 * 
 *     <!-- Review statistics container (optional) -->
 *     <div id="reviewStats"></div>
 * 
 *     <!-- Review section container -->
 *     <div id="reviewContainer"></div>
 * 
 *     <!-- Scripts -->
 *     <script src="assets/js/reviewHelpers.js"></script>
 *     <script src="app/user/models/review/ReviewModel.js"></script>
 *     <script src="app/user/views/review/ReviewView.js"></script>
 *     <script src="app/user/controllers/review/ReviewController.js"></script>
 *     <script src="assets/js/ReviewIntegrationExample.js"></script>
 * 
 *     <script>
 *         document.addEventListener('DOMContentLoaded', async () => {
 *             // Load review section HTML
 *             await loadReviewSectionDynamically('reviewContainer');
 * 
 *             // Display review statistics
 *             const bookId = getCurrentBookIdFromPage();
 *             await displayReviewStatistics(bookId, 'reviewStats');
 * 
 *             // Initialize review feature
 *             await initializeReviewFeature();
 *         });
 *     </script>
 * </body>
 * </html>
 */

/**
 * Example: Refresh reviews after any external changes
 */
function refreshReviews() {
    if (!window.reviewController) {
        console.error('Review controller not initialized');
        return;
    }

    const bookId = getCurrentBookIdFromPage();
    window.reviewController.init(bookId);
}

/**
 * Example: Filter and display reviews by rating
 */
function displayReviewsByRating(bookId, rating) {
    try {
        const reviews = window.reviewController.reviews;
        const filteredReviews = filterReviewsByRating(reviews, rating);

        if (window.reviewController.reviewView) {
            window.reviewController.reviewView.renderReviewList(filteredReviews);
        }
    } catch (error) {
        console.error('Error filtering reviews:', error);
    }
}

/**
 * Example: Sort reviews by date
 */
function sortReviewsNewest() {
    try {
        const reviews = window.reviewController.reviews;
        const bookId = getCurrentBookIdFromPage();
        const bookReviews = reviews.filter(r => r.bookId == bookId);
        const sortedReviews = sortReviewsByDate(bookReviews);

        if (window.reviewController.reviewView) {
            window.reviewController.reviewView.renderReviewList(sortedReviews);
        }
    } catch (error) {
        console.error('Error sorting reviews:', error);
    }
}

/**
 * Example: Sort reviews by rating (highest first)
 */
function sortReviewsHighestRating() {
    try {
        const reviews = window.reviewController.reviews;
        const bookId = getCurrentBookIdFromPage();
        const bookReviews = reviews.filter(r => r.bookId == bookId);
        const sortedReviews = sortReviewsByRating(bookReviews);

        if (window.reviewController.reviewView) {
            window.reviewController.reviewView.renderReviewList(sortedReviews);
        }
    } catch (error) {
        console.error('Error sorting reviews:', error);
    }
}

// Export functions for use in other modules (if using ES6 modules)
// export { initializeReviewFeature, loadReviewSectionDynamically, displayReviewStatistics };
