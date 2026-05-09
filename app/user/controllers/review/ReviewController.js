/**
 * ReviewController.js
 * Xử lý logic: Model -> View
 */
class ReviewController {
    constructor() {
        this.model = new ReviewModel();
        this.view = new ReviewView();
        this.reviews = [];
        this.currentBookId = null;
        this.currentUserId = null;
    }

    /**
     * Khởi tạo: Load reviews, render bằng View
     */
    async init(bookId) {
        this.currentBookId = bookId;
        this.currentUserId = this._getCurrentUserId();

        // Setup form callbacks FIRST (before showing any content)
        this.view.onFormSubmit((formData) => this.handleSubmitForm(formData));
        this.view.onFormCancel(() => this.handleCancelForm());

        try {
            this.view.showLoading();
            const data = await this.model.getReviewsByBookId(bookId);
            this.reviews = Array.isArray(data) ? data : [];
            this.view.renderReviews(this.reviews, this.currentUserId);
            this.view.attachEventListeners(() => this);
        } catch (error) {
            this.view.showError('Lỗi tải đánh giá: ' + error.message);
            console.error('Error loading reviews:', error);
        }
    }

    /**
     * Lấy userId từ localStorage hoặc JWT
     */
    _getCurrentUserId() {
        const userId = localStorage.getItem('userId');
        if (userId) return parseInt(userId);

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.id) return parseInt(user.id);
        } catch (e) { }

        return null;
    }

    /**
     * Xử lý hành động từ View
     */
    async handleAction(action, reviewId) {
        try {
            if (action === 'edit') {
                const review = this.reviews.find(r => r.id == reviewId);
                if (review && review.userId == this.currentUserId) {
                    this.view.showForm(review);
                } else {
                    alert('Bạn không có quyền sửa đánh giá này');
                }
            } else if (action === 'delete') {
                if (confirm('Xóa đánh giá này?')) {
                    await this.model.deleteReview(reviewId);
                    alert('Xóa thành công');
                    await this.init(this.currentBookId); // Reload
                }
            }
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    }

    /**
     * Xử lý gửi form
     */
    async handleSubmitForm(formData) {
        try {
            if (formData.id) {
                // Update
                await this.model.updateReview(formData.id, {
                    userId: this.currentUserId,
                    bookId: this.currentBookId,
                    rating: formData.rating,
                    comment: formData.comment
                });
                alert('Cập nhật thành công');
            } else {
                // Create
                await this.model.createReview({
                    userId: this.currentUserId,
                    bookId: this.currentBookId,
                    rating: formData.rating,
                    comment: formData.comment
                });
                alert('Thêm đánh giá thành công');
            }
            this.view.hideForm();
            await this.init(this.currentBookId); // Reload
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    }

    /**
     * Xử lý hủy form
     */
    handleCancelForm() {
        this.view.hideForm();
    }

    /**
     * Xử lý bấm nút "Viết đánh giá"
     */
    handleAddReviewClick() {
        if (!this.currentUserId) {
            alert('Vui lòng đăng nhập để viết đánh giá');
            return;
        }
        this.view.showForm();
    }

    /**
     * Xóa đánh giá
     * @param {number} reviewId - ID của đánh giá cần xóa
     */
    async handleDeleteReview(reviewId) {
        const review = this.reviews.find(r => r.id == reviewId);

        if (review && review.userId != this.currentUserId) {
            alert("Bạn không có quyền xóa đánh giá này");
            return;
        }

        if (!confirm("Bạn có chắc chắn muốn xóa đánh giá?")) {
            return;
        }

        try {
            await this.model.deleteReview(reviewId);
            this.reviews = this.reviews.filter(r => r.id != reviewId);
            alert("Xóa đánh giá thành công");
            await this.init(this.currentBookId); // Reload danh sách
        } catch (error) {
            console.error('Lỗi xóa đánh giá:', error);
            alert("Lỗi khi xóa đánh giá");
        }
    }

    /**
     * Kiểm tra dữ liệu form
     * @param {Object} formData - Dữ liệu form cần kiểm tra
     * @returns {boolean} - True nếu hợp lệ, False nếu không
     */
    validateFormData(formData) {
        const { userId, bookId, rating, comment } = formData;

        console.log('[ReviewController] Validating form data:', {
            userId,
            bookId,
            rating,
            commentLength: comment?.length
        });

        // Kiểm tra userId
        if (!userId || isNaN(userId)) {
            alert(`Lỗi: Không lấy được ID người dùng. Vui lòng đăng nhập lại.`);
            return false;
        }

        // Kiểm tra bookId
        if (!bookId || isNaN(bookId)) {
            alert(`Lỗi: Không lấy được ID sách. Vui lòng tải lại trang.`);
            return false;
        }

        // Kiểm tra rating (1-5 sao)
        if (!rating || rating < 1 || rating > 5) {
            alert("Vui lòng chọn điểm đánh giá (1-5 sao)");
            return false;
        }

        // Kiểm tra comment
        if (!comment || comment.trim().length < 10) {
            alert("Bình luận phải tối thiểu 10 ký tự");
            return false;
        }

        if (comment.length > 500) {
            alert("Bình luận không được vượt quá 500 ký tự");
            return false;
        }

        return true;
    }
}

