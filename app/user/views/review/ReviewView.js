/**
 * ReviewView.js
 * Hiển thị danh sách đánh giá và form, không dùng async/await trong render
 * Code HTML cứng bằng Template Literals
 */
class ReviewView {
    constructor() {
        // Match IDs from book_detail.html
        this.reviewList = document.getElementById('reviewList') || document.getElementById('reviewContainer') || document.getElementById('review-list');
        this.reviewForm = document.getElementById('reviewForm') || document.getElementById('review-form');
        this.addReviewBtn = document.getElementById('addReviewBtn') || document.getElementById('add-review-btn');

        // Initialize form callbacks storage
        this._onFormSubmit = null;
        this._onFormCancel = null;
    }

    /**
     * Render danh sách đánh giá
     */
    renderReviews(reviews, currentUserId) {
        if (!this.reviewList) return;

        if (!reviews || reviews.length === 0) {
            this.reviewList.innerHTML = `
                <div class="empty-state">
                    <p>Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá!</p>
                </div>
            `;
            return;
        }

        // Map reviews thành HTML chuỗi
        this.reviewList.innerHTML = reviews.map(review => `
            <div class="review-card" data-review-id="${review.id}">
                <div class="review-header">
                    <span class="review-author">${review.fullName || 'Ẩn danh'}</span>
                    <span class="review-date">${this._formatDate(review.createdAt)}</span>
                </div>
                <div class="review-rating">
                    ${this._createStars(review.rating)}
                </div>
                <div class="review-comment">${review.comment}</div>
                ${review.userId == currentUserId ? `
                    <div class="review-actions">
                        <button class="btn-action" data-action="edit">Sửa</button>
                        <button class="btn-action btn-danger" data-action="delete">Xóa</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    /**
     * Hiển thị form (add/edit)
     */
    showForm(review = null) {
        if (!this.reviewForm) return;

        const isEdit = review !== null;
        const rating = review?.rating || 0;
        const comment = review?.comment || '';

        this.reviewForm.innerHTML = `
            <div class="form-wrapper">
                <h3>${isEdit ? 'Sửa đánh giá' : 'Viết đánh giá'}</h3>
                <form class="review-form-content">
                    <div class="form-group">
                        <label>Đánh giá:</label>
                        <div class="star-inputs">
                            ${[1, 2, 3, 4, 5].map(i => `
                                <label>
                                    <input type="radio" name="rating" value="${i}" ${rating == i ? 'checked' : ''}>
                                    <span class="star">★</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Bình luận:</label>
                        <textarea 
                            class="comment-input" 
                            placeholder="Chia sẻ cảm nhận..." 
                            maxlength="500"
                            rows="5"
                        >${comment}</textarea>
                        <small><span class="char-count">0</span>/500</small>
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="btn-submit">Gửi</button>
                        <button type="button" class="btn-cancel">Hủy</button>
                    </div>
                </form>
            </div>
        `;

        this.reviewForm.classList.add('show');

        // Event delegation cho form
        const form = this.reviewForm.querySelector('.review-form-content');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = this.reviewForm.querySelector('input[name="rating"]:checked')?.value || 0;
            const comment = this.reviewForm.querySelector('.comment-input')?.value || '';

            this._onFormSubmit?.({ id: review?.id, rating: parseInt(rating), comment });
        });

        const cancelBtn = this.reviewForm.querySelector('.btn-cancel');
        cancelBtn?.addEventListener('click', () => {
            this._onFormCancel?.();
        });

        // Update char counter
        const textarea = this.reviewForm.querySelector('.comment-input');
        textarea?.addEventListener('input', (e) => {
            this.reviewForm.querySelector('.char-count').textContent = e.target.value.length;
        });
        this.reviewForm.querySelector('.char-count').textContent = comment.length;
    }

    /**
     * Ẩn form
     */
    hideForm() {
        if (!this.reviewForm) return;
        this.reviewForm.classList.remove('show');
        setTimeout(() => {
            this.reviewForm.innerHTML = '';
        }, 300);
    }

    /**
     * Event Delegation: Gắn listener vào review list
     */
    attachEventListeners(controllerCallback) {
        if (!this.reviewList) return;

        this.reviewList.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-action');
            if (!btn) return;

            const action = btn.dataset.action;
            const card = e.target.closest('.review-card');
            const reviewId = card.dataset.reviewId;

            const controller = controllerCallback();
            controller.handleAction(action, reviewId);
        });
    }

    /**
     * Khi submit form
     */
    onFormSubmit(callback) {
        this._onFormSubmit = callback;
        return this; // Enable method chaining
    }

    /**
     * Khi hủy form
     */
    onFormCancel(callback) {
        this._onFormCancel = callback;
        return this; // Enable method chaining
    }

    /**
     * Hiển thị loading
     */
    showLoading() {
        if (this.reviewList) {
            this.reviewList.innerHTML = '<div class="loading">Đang tải...</div>';
        }
    }

    /**
     * Hiển thị lỗi
     */
    showError(message) {
        if (this.reviewList) {
            this.reviewList.innerHTML = `<div class="error">${message}</div>`;
        }
    }

    /**
     * Tạo HTML sao
     */
    _createStars(rating) {
        return [1, 2, 3, 4, 5].map(i =>
            `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`
        ).join('');
    }

    /**
     * Format ngày
     */
    _formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        if (isNaN(date)) return 'N/A';
        return date.toLocaleDateString('vi-VN');
    }
}

