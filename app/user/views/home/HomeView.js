class HomeView {
    constructor() {
        this.newArrivalsContainer = document.getElementById('new-arrivals-container');
        this.mostPopularContainer = document.getElementById('most-popular-container');
        this.loadingElement = document.getElementById('page-loading');
        this.wishlistModel = null;
        this.wishlistBookIds = []; // Track which books are in wishlist
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
                <strong>Lỗi:</strong> ${message}
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
    async renderNewArrivals(books) {
        this.hideLoading();

        if (!this.newArrivalsContainer) {
            console.warn('Không tìm thấy vùng chứa sản phẩm mới');
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

        // Create all book cards in parallel
        const bookCards = await Promise.all(books.map(book => this.createBookCard(book)));

        // Append to container
        bookCards.forEach(card => {
            this.newArrivalsContainer.appendChild(card);
        });
    }

    /**
     * Render most popular section with book cards
     * @param {Array} books - Array of most popular book objects
     */
    async renderMostPopular(books) {
        if (!this.mostPopularContainer) {
            console.warn('Không tìm thấy vùng chứa sản phẩm phổ biến');
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

        // Create all book cards in parallel
        const bookCards = await Promise.all(books.map(book => this.createBookCard(book)));

        // Append to container
        bookCards.forEach(card => {
            this.mostPopularContainer.appendChild(card);
        });
    }

    /**
     * Create a single book card element using reusable BookCard component
     * Handles image display, fallbacks, badges, wishlist, and navigation
     * @param {Object} book - Book object from backend with: id, title, author_id, imageUrl, category_id, availableQty, totalQty
     * @returns {HTMLElement} - Book card DOM element (wrapped in column div)
     */
    createBookCard(book) {
        // ✅ Check if this book is in wishlist
        const isInWishlist = this.wishlistBookIds.includes(book.id);

        // ✅ Use reusable BookCard component with shared ImageService
        return BookCard.create(book, {
            showFavoriteBtn: true,
            imageField: 'imageUrl', // Use imageUrl from backend response
            wishlistModel: this.wishlistModel, // ✅ Pass WishlistModel for add to wishlist
            isInWishlist: isInWishlist, // ✅ Pass current wishlist status
            onCardClick: (bookData) => {
                // ✅ Navigate to book details when card is clicked
                window.location.href = `../book/book_detail.html?id=${bookData.id}`;
            },
            onWishlistChange: (bookData, inWishlist) => {
                // ✅ Update local state when wishlist changes
                if (inWishlist && !this.wishlistBookIds.includes(bookData.id)) {
                    this.wishlistBookIds.push(bookData.id);
                } else if (!inWishlist && this.wishlistBookIds.includes(bookData.id)) {
                    this.wishlistBookIds = this.wishlistBookIds.filter(id => id !== bookData.id);
                }
            }
        });
    }

    /**
     * Bind wishlist model for add to wishlist functionality
     * @param {Object} wishlistModel - WishlistModel instance
     */
    bindWishlistModel(wishlistModel) {
        this.wishlistModel = wishlistModel;
    }

    /**
     * Bind wishlist book IDs to check status
     * @param {Array} wishlistBookIds - Array of book IDs in wishlist
     */
    bindWishlistBookIds(wishlistBookIds) {
        this.wishlistBookIds = wishlistBookIds || [];
    }

}
