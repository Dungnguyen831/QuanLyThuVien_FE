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
    this.wishlistGrid = document.getElementById("wishlist-items");
    this.wishlistSubtitle = document.getElementById("wishlist-subtitle");
    this.borrowAllBtn = document.getElementById("borrow-all-btn");
    this.filterPills = document.querySelectorAll(".filter-pill");
    this.paginationNumbers = document.getElementById("pagination-numbers");
    this.paginationPrev = document.getElementById("pagination-prev");
    this.paginationNext = document.getElementById("pagination-next");
    this.eventListeners = {};
  }

  /**
   * Render wishlist books as a grid of cards using BookCard component
   * @param {Array} books - Array of book objects to render
   * @param {Object} wishlistModel - WishlistModel instance for remove action
   */
  async renderWishlistBooks(books, wishlistModel = null) {
    if (!books || books.length === 0) {
      this.wishlistGrid.innerHTML =
        '<div class="empty-state">Chưa có sách nào trong danh sách yêu thích của bạn.</div>';
      return;
    }

    // Clear grid
    this.wishlistGrid.innerHTML = '';

    // Create all book cards in parallel using Promise.all
    const bookCardPromises = books.map(book =>
      BookCard.create(book, {
        showFavoriteBtn: true,
        isInWishlist: true, // ✅ All books on wishlist page are in wishlist
        wishlistModel: wishlistModel, // ✅ Pass model to handle remove
        onCardClick: (bookData) => {
          // ✅ Navigate to book detail page when card is clicked
          window.location.href = `../book/book_detail.html?id=${bookData.id}`;
        },
        onFavoriteClick: (bookData) => {
          // ✅ BookCard already called removeFromWishlist, skip API call
          if (this.eventListeners.removeFromWishlist) {
            this.eventListeners.removeFromWishlist(bookData.id, null, true);
          }
        },
        onWishlistChange: (bookData, inWishlist) => {
          // When removed from wishlist, trigger remove action
          if (!inWishlist && this.eventListeners.removeFromWishlist) {
            // ✅ Skip API call since BookCard already did it
            this.eventListeners.removeFromWishlist(bookData.id, null, true);
          }
        },
        imageField: 'imageUrl' // Use imageUrl from backend response
      })
    );

    // Wait for all book cards to be created
    const bookCardElements = await Promise.all(bookCardPromises);

    // Append to grid (Grid CSS will handle layout, no column classes needed)
    bookCardElements.forEach(bookCardElement => {
      this.wishlistGrid.appendChild(bookCardElement);
    });
  }

  /**
   * Create individual book card HTML
   * @private
   * @param {Object} book - Book object with properties: id, title, author, cover, rating, inWishlist
   * @returns {string} HTML string for book card
   */

  /**
   * Escape HTML special characters to prevent XSS
   * @private
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  _escapeHtml(text) {
    if (!text) {
      console.warn("⚠️ Trường bị thiếu trong dữ liệu sách:", text);
      return "";
    }
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return String(text).replace(/[&<>"']/g, (char) => map[char]);
  }

  /**
   * Update the wishlist items counter subtitle
   * @param {number} count - Total number of items in wishlist
   */
  updateItemsCounter(count) {
    const itemText = count === 1 ? "mục" : "mục";
    this.wishlistSubtitle.textContent = `Bạn có ${count} ${itemText} được lưu để khám phá sau.`;
  }

  /**
   * Render pagination buttons
   * @param {number} totalPages - Total number of pages
   * @param {number} currentPage - Current active page (1-based)
   */
  renderPagination(totalPages, currentPage) {
    this.paginationNumbers.innerHTML = "";

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
    const button = document.createElement("button");
    button.className = `pagination-number ${isActive ? "active" : ""}`;
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
    const ellipsis = document.createElement("span");
    ellipsis.className = "pagination-ellipsis";
    ellipsis.textContent = "...";
    this.paginationNumbers.appendChild(ellipsis);
  }

  /**
   * Set active filter pill
   * @param {string} filterValue - The filter value to activate
   */
  setActiveFilter(filterValue) {
    this.filterPills.forEach((pill) => {
      if (pill.dataset.filter === filterValue) {
        pill.classList.add("active");
      } else {
        pill.classList.remove("active");
      }
    });
  }

  /**
   * Get current active filter
   * @returns {string} Active filter value
   */
  getActiveFilter() {
    const activePill = document.querySelector(".filter-pill.active");
    return activePill ? activePill.dataset.filter : "all";
  }

  /**
   * Get current sort value
   * @returns {string} Current sort dropdown value
   */
  getSortValue() {
    return this.sortDropdown.value;
  }




  /**
   * Bind pagination page button clicks
   * @param {Function} callback - Callback function with page number
   */
  onPaginationClick(callback) {
    this.eventListeners.paginationClick = callback;
    this.paginationNumbers.addEventListener("click", (e) => {
      if (e.target.classList.contains("pagination-number")) {
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
    this.paginationPrev.addEventListener("click", callback);
  }

  /**
   * Bind next pagination button
   * @param {Function} callback - Callback function when next is clicked
   */
  onPaginationNext(callback) {
    this.eventListeners.paginationNext = callback;
    this.paginationNext.addEventListener("click", callback);
  }

  /**
   * Bind heart icon (wishlist) click events
   * @param {Function} callback - Callback function with book id
   */
  onHeartIconClick(callback) {
    this.eventListeners.heartIconClick = callback;
    this.wishlistGrid.addEventListener("click", (e) => {
      const heartBtn = e.target.closest(".heart-icon");
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
    this.borrowAllBtn.addEventListener("click", callback);
  }

  /**
   * Show loading state
   */
  showLoading() {
    this.wishlistGrid.innerHTML =
      '<div class="loading-state">Đang tải danh sách yêu thích của bạn...</div>';
  }

  /**
   * Show error state
   * @param {string} message - Error message to display
   */
  showError(message) {
    this.wishlistGrid.innerHTML = `<div class="error-state">${this._escapeHtml(message)}</div>`;
  }
}
