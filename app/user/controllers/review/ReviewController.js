/**
 * ReviewController.js - Handle business logic for Book Reviews
 * Manages review state, user interactions, and coordinates between Model and View
 */

class ReviewController {
    constructor() {
        this.reviewModel = new ReviewModel();
        this.reviewView = new ReviewView(this);
        this.currentBookId = null;
        this.currentUserId = null;
        this.reviews = [];
        this.currentEditingReviewId = null;
    }

    /**
     * Initialize review controller - call when book detail page loads
     * @param {number} bookId - The book ID to load reviews for
     */
    async init(bookId) {
        this.currentBookId = bookId;
        this.currentUserId = getCurrentUserIdFromSession();

        this.reviewView.showLoadingState();
        try {
            // Lấy reviews của sách này từ backend
            this.reviews = await this.reviewModel.getReviewsByBookId(bookId);
            this.reviewView.renderReviewList(this.reviews);
            this.reviewView.hideLoadingState();
        } catch (error) {
            console.error('Lỗi tải đánh giá:', error);
            this.reviewView.showErrorMessage("Lỗi tải danh sách đánh giá");
            this.reviewView.hideLoadingState();
        }
    }

    /**
     * Handle add review button click
     */
    handleAddReviewClick() {
        this.currentEditingReviewId = null;
        this.reviewView.renderReviewForm(null); // Empty form
    }

    /**
     * Handle edit review button click
     * @param {number} reviewId - Review ID to edit
     */
    handleEditReviewClick(reviewId) {
        const review = this.reviews.find(r => r.id == reviewId);
        if (review && review.userId == this.currentUserId) {
            this.currentEditingReviewId = reviewId;
            this.reviewView.renderReviewForm(review); // Pre-fill form
        } else {
            this.reviewView.showErrorMessage("Bạn không có quyền sửa đánh giá này");
        }
    }

    /**
     * Handle cancel form
     */
    handleCancelForm() {
        this.currentEditingReviewId = null;
        this.reviewView.hideReviewForm();
    }

    /**
     * Handle form submission (add or update review)
     * @param {Object} formData - Form data { userId, bookId, rating, comment }
     */
    async handleSubmitForm(formData) {
        // Validation
        if (!this.validateFormData(formData)) {
            return;
        }

        this.reviewView.showLoadingState();
        try {
            if (this.currentEditingReviewId) {
                // Update existing review
                const updatedReview = await this.reviewModel.updateReview(
                    this.currentEditingReviewId,
                    formData
                );
                // Update reviews array
                this.reviews = this.reviews.map(r =>
                    r.id == this.currentEditingReviewId ? updatedReview : r
                );
                this.reviewView.showSuccessMessage("Cập nhật đánh giá thành công");
            } else {
                // Create new review
                const newReview = await this.reviewModel.createReview(formData);
                this.reviews.push(newReview);
                this.reviewView.showSuccessMessage("Thêm đánh giá thành công");
            }

            // Refresh review list
            const bookReviews = this.reviews.filter(r => r.bookId == this.currentBookId);
            this.reviewView.renderReviewList(bookReviews);
            this.reviewView.hideReviewForm();
            this.currentEditingReviewId = null;

        } catch (error) {
            console.error('Lỗi lưu đánh giá:', error);
            this.reviewView.showErrorMessage(error.message || "Lỗi khi lưu đánh giá");
        } finally {
            this.reviewView.hideLoadingState();
        }
    }

    /**
     * Handle delete review
     * @param {number} reviewId - Review ID to delete
     */
    async handleDeleteReview(reviewId) {
        const review = this.reviews.find(r => r.id == reviewId);

        if (review && review.userId != this.currentUserId) {
            this.reviewView.showErrorMessage("Bạn không có quyền xóa đánh giá này");
            return;
        }

        if (!confirm("Bạn có chắc chắn muốn xóa đánh giá?")) {
            return;
        }

        this.reviewView.showLoadingState();
        try {
            await this.reviewModel.deleteReview(reviewId);
            this.reviews = this.reviews.filter(r => r.id != reviewId);

            // Refresh review list
            const bookReviews = this.reviews.filter(r => r.bookId == this.currentBookId);
            this.reviewView.renderReviewList(bookReviews);
            this.reviewView.showSuccessMessage("Xóa đánh giá thành công");

        } catch (error) {
            console.error('Lỗi xóa đánh giá:', error);
            this.reviewView.showErrorMessage("Lỗi khi xóa đánh giá");
        } finally {
            this.reviewView.hideLoadingState();
        }
    }

    /**
     * Validate form data
     * @param {Object} formData - Form data to validate
     * @returns {boolean} - True if valid, false otherwise
     */
    validateFormData(formData) {
        const { userId, bookId, rating, comment } = formData;

        // Debug log
        console.log('[ReviewController] Validating form data:', {
            userId,
            bookId,
            rating,
            commentLength: comment?.length,
            localStorageUser: localStorage.getItem('user'),
            localStorageToken: localStorage.getItem('token') ? 'EXISTS' : 'MISSING'
        });

        // Kiểm tra userId tồn tại
        if (!userId || isNaN(userId)) {
            const errorMsg = `Lỗi: Không lấy được ID người dùng. userId=${userId}. Vui lòng đăng nhập lại.`;
            console.error('[ReviewController]', errorMsg);
            this.reviewView.showErrorMessage(errorMsg);
            return false;
        }

        // Kiểm tra bookId tồn tại
        if (!bookId || isNaN(bookId)) {
            const errorMsg = `Lỗi: Không lấy được ID sách. bookId=${bookId}. Vui lòng tải lại trang.`;
            console.error('[ReviewController]', errorMsg);
            this.reviewView.showErrorMessage(errorMsg);
            return false;
        }

        // Kiểm tra rating (1-5 sao)
        if (!rating || rating < 1 || rating > 5) {
            this.reviewView.showErrorMessage("Vui lòng chọn điểm đánh giá (1-5 sao)");
            return false;
        }

        // Kiểm tra comment
        if (!comment || comment.trim().length < 10) {
            this.reviewView.showErrorMessage("Bình luận phải tối thiểu 10 ký tự");
            return false;
        }

        if (comment.length > 500) {
            this.reviewView.showErrorMessage("Bình luận không được vượt quá 500 ký tự");
            return false;
        }

        return true;
    }
}
