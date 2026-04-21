/**
 * Reservation Controller Class
 * Orchestrates communication between ReservationModel and ReservationView
 * Handles business logic and user interactions
 */
class ReservationController {
    constructor(reservationModel, reservationView) {
        this.model = reservationModel;
        this.view = reservationView;

        // Initialize the page
        this.init();
    }

    /**
     * Initialize the controller
     */
    async init() {
        try {
            this.view.showLoading();

            // Bind view events
            this.bindViewEvents();

            // Load and render dashboard data
            await this.loadDashboardData();
        } catch (error) {
            console.error('Lỗi khởi tạo ReservationController:', error);
            this.view.showError('Không thể tải đặt chỗ. Vui lòng thử lại sau.');
        }
    }

    /**
     * Bind all view event handlers
     */
    bindViewEvents() {
        this.view.onNewReservationClick(() => this.handleNewReservation());
        this.view.onDetailsClick((reservationId) => this.handleViewDetails(reservationId));
        this.view.onConfirmPickupClick((reservationId) => this.handleConfirmPickup(reservationId));
        this.view.onCancelClick((reservationId) => this.handleCancelReservation(reservationId));
    }

    /**
     * Load dashboard data from model and render to view
     */
    async loadDashboardData() {
        try {
            // Call new endpoint that returns combined reservation+book data
            const reservations = await this.model.getUserReservationsWithBooks();

            if (reservations) {
                // ✅ Store reservations for later use in edit/details operations
                this.reservations = reservations;

                // Calculate stats from reservation data
                const stats = this._calculateStatsFromReservations(reservations);

                // Update stats cards
                this.view.updateStatsCards(stats);

                // Render reservation table with combined data
                this.view.renderReservationTable(reservations);
            }
        } catch (error) {
            console.error('Lỗi tải dữ liệu bảng điều khiển:', error);
            this.view.showError('Không thể tải đặt chỗ của bạn.');
            throw error;
        }
    }

    /**
     * Calculate stats from reservation data
     * @private
     * @param {Array} reservations - Array of reservations with book details
     * @returns {Object} Calculated stats
     */
    _calculateStatsFromReservations(reservations) {
        if (!reservations || !Array.isArray(reservations)) {
            return { activeBorrows: 0, upcomingDue: 0, activeReservations: 0 };
        }

        // Count APPROVED reservations (ready for pickup)
        const approvedCount = reservations.filter(r => r.status && r.status.toUpperCase() === 'APPROVED').length;

        // Count PENDING reservations (waiting for approval)
        const pendingCount = reservations.filter(r => r.status && r.status.toUpperCase() === 'PENDING').length;

        // Count active reservations (PENDING + APPROVED, excluding CANCELLED and COMPLETED)
        const activeCount = reservations.filter(r => {
            const status = r.status && r.status.toUpperCase();
            return status === 'PENDING' || status === 'APPROVED';
        }).length;

        return {
            activeBorrows: approvedCount,
            upcomingDue: pendingCount,
            activeReservations: activeCount
        };
    }

    /**
     * Handle new reservation button click
     */
    async handleNewReservation() {
        try {
            // Fetch all available books for user to choose from
            const allBooks = await this._getAvailableBooksForReservation();

            // Create borrow form modal in selection mode
            const formModal = await BorrowForm.create({
                books: allBooks,
                mode: 'selection',
                onSubmit: async (formData) => {
                    try {
                        console.log('Biểu mẫu mượn đã gửi:', formData);

                        // Validate pickup date with business rules
                        const dateValidation = BorrowForm.validatePickupDate(formData.pickupDate);
                        if (!dateValidation.valid) {
                            alert(dateValidation.message);
                            return; // Stay on form, don't close
                        }

                        // Format date to LocalDateTime format (YYYY-MM-DDTHH:mm:ss)
                        const formattedDate = BorrowForm.formatPickupDate(formData.pickupDate);

                        // Create reservation using the form data
                        await this.model.createReservation(
                            formData.bookId,
                            formattedDate
                        );

                        // Reload dashboard to show new reservation
                        await this.loadDashboardData();

                        alert('✅ Yêu cầu mượn sách thành công!\n\nVui lòng chờ xác nhận từ thư viện.');
                    } catch (error) {
                        console.error('Lỗi trong gửi biểu mẫu:', error);
                        alert('Lỗi: ' + (error.message || 'Không thể tạo yêu cầu mượn sách'));
                    }
                }
            });

            // Add modal to page
            document.body.appendChild(formModal);

        } catch (error) {
            console.error('Lỗi mở biểu mẫu đặt chỗ mới:', error);
            alert('Không thể mở biểu mẫu đặt chỗ. Vui lòng thử lại.');
        }
    }

    /**
     * Get available books for reservation
     * Uses AllBooksModel to fetch all available books
     * @private
     */
    async _getAvailableBooksForReservation() {
        try {
            // Use AllBooksModel to fetch books
            if (typeof AllBooksModel !== 'undefined') {
                const booksModel = new AllBooksModel();
                const books = await booksModel.fetchAllBooks();

                // Ensure books have the required structure (id, title)
                if (Array.isArray(books)) {
                    return books.map(book => ({
                        id: book.id || book.bookId,
                        title: book.title || book.bookTitle,
                        ...book // Include other properties too
                    }));
                }
                return [];
            }
            return [];
        } catch (error) {
            console.error('Lỗi tải sách sẵn có:', error);
            return [];
        }
    }

    /**
     * Handle edit reservation (called when user clicks edit for existing reservation)
     * ✅ FIXED: Get reservation from this.reservations array instead of API call
     * @param {number|string} reservationId - ID of reservation to edit
     */
    async handleEditReservation(reservationId) {
        try {
            // ✅ Get reservation from stored array (already fetched in loadDashboardData)
            const reservation = this._findReservationById(reservationId);

            if (!reservation) {
                throw new Error('Không tìm thấy đặt chỗ');
            }

            // ✅ Store current reservation for later use in form submission
            this.currentReservation = reservation;

            // Create form modal in UPDATE mode
            const formModal = await ReservationForm.create({
                reservation: reservation,
                availableBooks: [] // Not needed for UPDATE mode
            });

            // Open modal
            this.view.openReservationModal(formModal);

            // Setup form submission
            this.view.setupFormSubmissionHandler(formModal, async (form) => {
                await this._handleReservationFormSubmit(form, formModal, true, reservationId);
            });

        } catch (error) {
            console.error('Lỗi mở biểu mẫu sửa đặt chỗ:', error);
            alert('Không thể tải đặt chỗ để sửa. Vui lòng thử lại.');
        }
    }

    /**
     * Find reservation by ID from stored array
     * @private
     * @param {number|string} reservationId - ID to search for
     * @returns {Object|null} - Reservation object or null if not found
     */
    _findReservationById(reservationId) {
        if (!this.reservations || !Array.isArray(this.reservations)) {
            return null;
        }
        return this.reservations.find(r => r.id == reservationId) || null;
    }

    /**
     * Handle reservation form submission (both CREATE and UPDATE)
     * @private
     * @param {HTMLFormElement} form - Form element
     * @param {HTMLElement} formModal - Modal element
     * @param {boolean} isUpdate - Whether this is an UPDATE operation
     * @param {string|number} reservationId - ID if UPDATE mode
     */
    async _handleReservationFormSubmit(form, formModal, isUpdate = false, reservationId = null) {
        try {
            // Get form data - params: modal, isCreateMode
            const formData = ReservationForm.getFormData(formModal, !isUpdate);

            // Validate form data
            const validation = ReservationForm.validateFormData(formData, !isUpdate);
            if (!validation.isValid) {
                alert('Validation errors:\n' + validation.errors.join('\n'));
                return;
            }

            // Show loading state on button
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Đang xử lý...';

            try {
                if (isUpdate) {
                    // ✅ UPDATE existing reservation
                    // User can ONLY edit the date - bookId and status come from current reservation
                    console.log('[ReservationController] Đang cập nhật - Dữ liệu biểu mẫu:', formData);
                    console.log('[ReservationController] Đặt chỗ hiện tại:', this.currentReservation);

                    const updateData = {
                        bookId: this.currentReservation.bookId,  // Keep current bookId
                        reservationDate: formData.reservationDate,  // New date from form
                        status: this.currentReservation.status  // Keep current status
                    };

                    console.log('[ReservationController] Gửi dữ liệu cập nhật:', updateData);
                    await this.model.updateReservation(reservationId, updateData);

                    // Update table row without full reload
                    this.view.updateTableRow(reservationId, {
                        reservationDate: formData.reservationDate
                        // Trạng thái không cập nhật (giữ trạng thái cũ)
                    });

                    this.view.closeReservationModal(formModal);
                    alert('Đặt chỗ đã được cập nhật thành công!');
                } else {
                    // CREATE new reservation
                    // Pass: bookId, reservationDate, status
                    await this.model.createReservation(
                        formData.bookId,
                        formData.reservationDate,
                        formData.status // 'PENDING' by default
                    );

                    // Reload dashboard to show new reservation
                    await this.loadDashboardData();

                    this.view.closeReservationModal(formModal);
                    alert('Đặt chỗ đã được tạo thành công!');
                }
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }

        } catch (error) {
            console.error('Lỗi gửi biểu mẫu đặt chỗ:', error);
            alert('Lỗi: ' + (error.message || 'Không thể lưu đặt chỗ. Vui lòng thử lại.'));
        }
    }

    /**
     * Handle view details button click
     * @param {string|number} reservationId - ID of the reservation
     */
    async handleViewDetails(reservationId) {
        // Open the edit form for viewing/editing details
        await this.handleEditReservation(reservationId);
    }

    /**
     * Handle confirm pickup button click
     * @param {string|number} reservationId - ID of the reservation
     */
    async handleConfirmPickup(reservationId) {
        const confirmPickup = confirm('Xác nhận rằng bạn đã lấy sách này?');

        if (!confirmPickup) {
            return;
        }

        try {
            await this.model.confirmPickup(reservationId);

            // Reload dashboard data to update reservation status and stats
            await this.loadDashboardData();

            alert('Xác nhận lấy sách thành công!');
        } catch (error) {
            console.error('Lỗi xác nhận lấy sách:', error);
            alert('Không thể xác nhận lấy sách. Vui lòng thử lại.');
        }
    }

    /**
     * Handle cancel reservation button click
     * @param {string|number} reservationId - ID of the reservation to cancel
     */
    async handleCancelReservation(reservationId) {
        const confirmCancel = confirm('Bạn có chắc chắn muốn hủy đặt chỗ này không?');

        if (!confirmCancel) {
            return;
        }

        try {
            await this.model.cancelReservation(reservationId);

            // Remove row from table
            this.view.removeTableRow(reservationId);

            // Reload dashboard data to update stats
            await this.loadDashboardData();

            alert('Đặt chỗ đã được hủy thành công');
        } catch (error) {
            console.error('Lỗi hủy đặt chỗ:', error);
            alert('Không thể hủy đặt chỗ. Vui lòng thử lại.');
        }
    }
}