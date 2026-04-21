/**
 * ReviewView.js - Handle rendering and UI updates for reviews
 * Responsible for displaying review list, forms, and notifications
 */

// ========== Helper Functions ==========

/**
 * Decode JWT token để lấy userId
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload hoặc null
 */
function decodeJWT(token) {
    try {
        if (!token) return null;
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const decoded = JSON.parse(atob(parts[1]));
        return decoded;
    } catch (error) {
        console.error('Lỗi giải mã JWT:', error);
        return null;
    }
}

/**
 * Get current user ID from localStorage or JWT token
 * @returns {number|null} - User ID or null if not logged in
 */
function getCurrentUserIdFromSession() {
    // Cách 1: Lấy từ localStorage (nếu backend lưu)
    let userId = localStorage.getItem('userId');
    if (userId) {
        return parseInt(userId);
    }

    // Cách 2: Lấy từ 'user' object (sửa từ 'currentUser')
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.id) {
            return parseInt(user.id);
        }
        // Nếu user object không có id, thử lấy từ userId field
        if (user.userId) {
            return parseInt(user.userId);
        }
    } catch (error) {
        console.error('Lỗi phân tích người dùng từ localStorage:', error);
    }

    // Cách 3: Decode JWT token để lấy userId
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = decodeJWT(token);
        if (decoded && decoded.sub) {
            // 'sub' thường là user ID trong JWT
            return parseInt(decoded.sub);
        }
        if (decoded && decoded.userId) {
            return parseInt(decoded.userId);
        }
        if (decoded && decoded.id) {
            return parseInt(decoded.id);
        }
    }

    console.warn('[ReviewView] Không lấy được User ID từ localStorage hoặc JWT token');
    return null;
}

/**
 * Get current user's full name from localStorage
 * @returns {string|null} - User's full name or null if not available
 */
function getCurrentUserFullName() {
    try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.fullName) {
            return user.fullName;
        }
        // Fallback to other possible name fields
        if (user.name) {
            return user.name;
        }
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
    } catch (error) {
        console.error('Lỗi phân tích fullName người dùng từ localStorage:', error);
    }
    return null;
}

/**
 * Get current book ID from page
 * @returns {string|null} - Book ID or null
 */
function getCurrentBookIdFromPage() {
    const bookElement = document.querySelector('[data-book-id]');
    if (bookElement && bookElement.dataset.bookId) {
        return bookElement.dataset.bookId;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) return id;
    return null;
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} - Escaped HTML
 */
function escapeHTML(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// ========== ReviewView Class ==========

class ReviewView {
    constructor(reviewController) {
        this.reviewContainer = document.getElementById('reviewContainer');
        this.reviewListContainer = document.getElementById('reviewList');
        this.reviewFormContainer = document.getElementById('reviewForm');
        this.addReviewBtn = document.getElementById('addReviewBtn');
        this.reviewController = reviewController;
    }

    /**
     * Render the list of reviews
     * @param {Array} reviews - Array of review objects
     */
    renderReviewList(reviews) {
        if (!this.reviewListContainer) return;

        if (reviews.length === 0) {
            this.reviewListContainer.innerHTML =
                '<p class="empty-state">Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>';
            return;
        }

        this.reviewListContainer.innerHTML = reviews
            .map(review => this.createReviewCardHTML(review))
            .join('');

        // Attach event listeners
        reviews.forEach(review => {
            const editBtn = document.querySelector(`[data-edit-id="${review.id}"]`);
            const deleteBtn = document.querySelector(`[data-delete-id="${review.id}"]`);

            if (editBtn) {
                editBtn.addEventListener('click', () =>
                    this.reviewController.handleEditReviewClick(review.id)
                );
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () =>
                    this.reviewController.handleDeleteReview(review.id)
                );
            }
        });
    }

    /**
     * Create HTML markup for a single review card
     * @param {Object} review - Review object
     * @returns {string} - HTML string
     */
    createReviewCardHTML(review) {
        const currentUserId = getCurrentUserIdFromSession();
        const stars = this.createStarsHTML(review.rating);
        const formattedDate = this.formatDate(review.createdAt);
        const isOwner = review.userId == currentUserId;

        return `
      <div class="review-card" data-review-id="${review.id}">
        <div class="review-header">
          <div class="review-user-info">
            <h4 class="review-username">${escapeHTML(review.fullName || 'Ẩn danh')}</h4>
            <span class="review-date">${formattedDate}</span>
          </div>
          <div class="review-rating">${stars}</div>
        </div>
        <div class="review-comment">${escapeHTML(review.comment)}</div>
        ${isOwner ? `
          <div class="review-actions">
            <button class="btn-edit" data-edit-id="${review.id}">Sửa</button>
            <button class="btn-delete" data-delete-id="${review.id}">Xóa</button>
          </div>
        ` : ''}
      </div>
    `;
    }

    /**
     * Render the review form (for adding or editing)
     * @param {Object} review - Review object (null for new review)
     */
    renderReviewForm(review = null) {
        if (!this.reviewFormContainer) return;

        const isEdit = review !== null;
        const title = isEdit ? 'Sửa đánh giá' : 'Viết đánh giá';
        const rating = review?.rating || 0;
        const comment = review?.comment || '';

        const starsHTML = [1, 2, 3, 4, 5]
            .map(i => `
        <label class="star-label">
          <input type="radio" name="rating" value="${i}" ${rating == i ? 'checked' : ''}>
          <span class="star" data-rating="${i}">★</span>
        </label>
      `)
            .join('');

        this.reviewFormContainer.innerHTML = `
      <div class="review-form-wrapper">
        <h3>${title}</h3>
        <form id="reviewForm" class="review-form">
          <div class="form-group">
            <label>Đánh giá (Sao):</label>
            <div class="star-rating">
              ${starsHTML}
            </div>
            <span class="form-error" id="ratingError"></span>
          </div>

          <div class="form-group">
            <label>Bình luận:</label>
            <textarea
              id="commentInput"
              name="comment"
              placeholder="Chia sẻ cảm nhận của bạn..."
              maxlength="500"
              rows="5"
            >${comment}</textarea>
            <div class="char-count">
              <span id="charCounter">0</span>/500
            </div>
            <span class="form-error" id="commentError"></span>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit">Gửi</button>
            <button type="button" class="btn-cancel" id="cancelFormBtn">Hủy</button>
          </div>
        </form>
      </div>
    `;

        this.reviewFormContainer.classList.add('show');

        // Attach event listeners
        const form = document.getElementById('reviewForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = {
                    userId: parseInt(getCurrentUserIdFromSession()) || null,
                    bookId: parseInt(getCurrentBookIdFromPage()) || null,
                    rating: parseInt(document.querySelector('input[name="rating"]:checked')?.value || 0),
                    comment: document.getElementById('commentInput').value,
                    fullName: getCurrentUserFullName() || 'Anonymous'
                };
                this.reviewController.handleSubmitForm(formData);
            });
        }

        const cancelBtn = document.getElementById('cancelFormBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.reviewController.handleCancelForm();
            });
        }

        // Update character counter
        const commentInput = document.getElementById('commentInput');
        if (commentInput) {
            commentInput.addEventListener('input', (e) => {
                const charCounter = document.getElementById('charCounter');
                if (charCounter) {
                    charCounter.textContent = e.target.value.length;
                }
            });
        }

        // Update initial char counter
        const charCounter = document.getElementById('charCounter');
        if (charCounter) {
            charCounter.textContent = comment.length;
        }

        // Star rating interactive
        const starInputs = document.querySelectorAll('.star-rating input');
        starInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                document.querySelectorAll('.star-rating .star').forEach(star => {
                    star.classList.remove('active');
                });
                const selectedStar = document.querySelector(`[data-rating="${e.target.value}"]`);
                if (selectedStar) {
                    selectedStar.classList.add('active');
                }
            });
        });

        // Set initial active star
        if (rating > 0) {
            const initialStar = document.querySelector(`[data-rating="${rating}"]`);
            if (initialStar) {
                initialStar.classList.add('active');
            }
        }

        // Add click handler for star labels to show visual feedback
        const starLabels = document.querySelectorAll('.star-label');
        starLabels.forEach(label => {
            label.addEventListener('click', function () {
                const input = this.querySelector('input');
                const star = this.querySelector('.star');
                if (star && !star.classList.contains('active')) {
                    document.querySelectorAll('.star-rating .star').forEach(s => s.classList.remove('active'));
                    star.classList.add('active');
                }
            });
        });
    }

    /**
     * Hide the review form
     */
    hideReviewForm() {
        if (!this.reviewFormContainer) return;

        this.reviewFormContainer.classList.remove('show');
        setTimeout(() => {
            this.reviewFormContainer.innerHTML = '';
        }, 300);
    }

    /**
     * Show loading state
     */
    showLoadingState() {
        if (this.reviewContainer) {
            this.reviewContainer.innerHTML = '<div class="spinner"></div>';
        }
    }

    /**
     * Hide loading state
     */
    hideLoadingState() {
        if (this.reviewContainer) {
            const spinner = this.reviewContainer.querySelector('.spinner');
            if (spinner) spinner.remove();
        }
    }

    /**
     * Show success message toast
     * @param {string} message - Success message
     */
    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }

    /**
     * Show error message toast
     * @param {string} message - Error message
     */
    showErrorMessage(message) {
        this.showToast(message, 'error');
    }

    /**
     * Show toast notification
     * @param {string} message - Message text
     * @param {string} type - Toast type (success, error)
     */
    showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Create star rating HTML
     * @param {number} rating - Rating value (1-5)
     * @returns {string} - HTML string with stars
     */
    createStarsHTML(rating) {
        return Array(5)
            .fill(0)
            .map((_, i) => `<span class="star ${i < rating ? 'filled' : ''}">★</span>`)
            .join('');
    }

    /**
     * Format date to Vietnamese format
     * @param {string} dateString - Date string
     * @returns {string} - Formatted date
     */
    formatDate(dateString) {
        if (!dateString) return 'Ngày không xác định';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Ngày không xác định';

        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
