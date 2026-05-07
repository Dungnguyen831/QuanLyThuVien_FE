/**
 * ReservationController.js
 * Xử lý logic: Gọi Model để lấy data -> Truyền cho View để render
 */
class ReservationController {
    constructor() {
        this.model = new ReservationModel();
        this.view = new ReservationView();
        this.reservations = [];
    }

    /**
     * Khởi tạo: Load data từ Model, render bằng View
     */
    async init() {
        try {
            this.view.showLoading();
            const data = await this.model.getUserReservationsWithBooks();
            this.reservations = Array.isArray(data) ? data : [];

            // Debug: Log the raw data to see what backend is returning
            console.log('ReservationController.init() - Raw data from API:', data);
            console.log('ReservationController.init() - Processed reservations:', this.reservations);

            // Check if barcodes are present
            this.reservations.forEach(res => {
                console.log(`Reservation ${res.id}: barcode =`, res.book_copy_barcode);
            });

            // Tính stats
            const stats = {
                activeBorrows: this.reservations.filter(r => r.status === 'APPROVED').length,
                upcomingDue: this.reservations.filter(r => r.status === 'PENDING').length,
                activeReservations: this.reservations.filter(r =>
                    r.status === 'PENDING' || r.status === 'APPROVED'
                ).length
            };

            // Render
            this.view.renderStats(stats);
            this.view.renderReservations(this.reservations);
            this.view.attachEventListeners(() => this);
            this.view.attachNewReservationButton(() => this);
        } catch (error) {
            this.view.showError('Lỗi tải dữ liệu: ' + error.message);
            console.error('Error loading reservations:', error);
        }
    }

    /**
     * Xử lý hành động từ View
     */
    async handleAction(action, reservationId) {
        try {
            if (action === 'cancel') {
                if (confirm('Bạn chắc chắn muốn hủy đặt chỗ này?')) {
                    await this.model.cancelReservation(reservationId);
                    alert('Hủy đặt chỗ thành công');
                    // Reload page after cancel success
                    location.reload();
                }
            } else if (action === 'pickup') {
                if (confirm('Bạn chắc chắn muốn lấy sách?')) {
                    await this.model.confirmPickup(reservationId);
                    alert('Đã xác nhận lấy sách');
                    // Reload page after pickup success
                    location.reload();
                }
            } else if (action === 'details') {
                const res = this.reservations.find(r => r.id == reservationId);
                alert(`Sách: ${res.title}\nTác giả: ${res.author}\nTrạng thái: ${res.status}`);
            }
        } catch (error) {
            alert('Lỗi: ' + error.message);
        }
    }

    /**
     * Mở form tạo đặt chỗ mới
     */
    async openNewReservationForm() {
        try {
            // Fetch available books
            const books = await this.model.getAvailableBooks();

            if (!books || books.length === 0) {
                alert('Không có sách nào có sẵn để đặt chỗ');
                return;
            }

            // Create BorrowForm in selection mode
            const form = await BorrowForm.create({
                books: books,
                mode: 'selection',
                onSubmit: async (formData) => {
                    await this._submitNewReservation(formData);
                }
            });

            // Show form in document
            document.body.appendChild(form);
        } catch (error) {
            alert('Lỗi mở form: ' + error.message);
            console.error(error);
        }
    }

    /**
     * Xử lý gửi form tạo đặt chỗ mới
     */
    async _submitNewReservation(formData) {
        try {
            const bookId = formData.bookId || formData.book_id;
            if (!bookId) {
                throw new Error('Vui lòng chọn sách');
            }

            await this.model.createReservation(bookId);
            alert('Đặt chỗ thành công');
            location.reload();
        } catch (error) {
            alert('Lỗi tạo đặt chỗ: ' + error.message);
            console.error(error);
        }
    }
}