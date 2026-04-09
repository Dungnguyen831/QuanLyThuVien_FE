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
            console.error('Error initializing ReservationController:', error);
            this.view.showError('Failed to load reservations. Please try again later.');
        }
    }

    /**
     * Bind all view event handlers
     */
    bindViewEvents() {
        this.view.onNewReservationClick(() => this.handleNewReservation());
        this.view.onDetailsClick((reservationId) => this.handleViewDetails(reservationId));
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
                // Calculate stats from reservation data
                const stats = this._calculateStatsFromReservations(reservations);

                // Update stats cards
                this.view.updateStatsCards(stats);

                // Render reservation table with combined data
                this.view.renderReservationTable(reservations);
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.view.showError('Unable to load your reservations.');
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
                        console.log('Borrow form submitted:', formData);

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
                        console.error('Error in form submission:', error);
                        alert('Lỗi: ' + (error.message || 'Không thể tạo yêu cầu mượn sách'));
                    }
                }
            });

            // Add modal to page
            document.body.appendChild(formModal);

        } catch (error) {
            console.error('Error opening new reservation form:', error);
            alert('Failed to open reservation form. Please try again.');
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
            console.error('Error fetching available books:', error);
            return [];
        }
    }

    /**
     * Handle edit reservation (called when user clicks edit for existing reservation)
     * @param {number|string} reservationId - ID of reservation to edit
     */
    async handleEditReservation(reservationId) {
        try {
            // Fetch reservation details
            const reservation = await this.model.getReservationDetails(reservationId);

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
            console.error('Error opening edit reservation form:', error);
            alert('Failed to load reservation for editing. Please try again.');
        }
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
            submitBtn.textContent = 'Processing...';

            try {
                if (isUpdate) {
                    // UPDATE existing reservation
                    const updateData = {
                        reservationDate: formData.reservationDate,
                        status: formData.status
                    };

                    await this.model.updateReservation(reservationId, updateData);

                    // Update table row without full reload
                    this.view.updateTableRow(reservationId, {
                        reservationDate: formData.reservationDate,
                        status: formData.status
                    });

                    this.view.closeReservationModal(formModal);
                    alert('Reservation updated successfully!');
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
                    alert('Reservation created successfully!');
                }
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }

        } catch (error) {
            console.error('Error submitting reservation form:', error);
            alert('Error: ' + (error.message || 'Failed to save reservation. Please try again.'));
        }
    }

    /**
     * Handle view details button click
     * @param {string|number} reservationId - ID of the reservation
     */
    handleViewDetails(reservationId) {
        // Open the edit form for viewing/editing details
        this.handleEditReservation(reservationId);
    }

    /**
     * Handle cancel reservation button click
     * @param {string|number} reservationId - ID of the reservation to cancel
     */
    async handleCancelReservation(reservationId) {
        const confirmCancel = confirm('Are you sure you want to cancel this reservation?');

        if (!confirmCancel) {
            return;
        }

        try {
            await this.model.cancelReservation(reservationId);

            // Remove row from table
            this.view.removeTableRow(reservationId);

            // Reload dashboard data to update stats
            await this.loadDashboardData();

            alert('Reservation cancelled successfully');
        } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Failed to cancel reservation. Please try again.');
        }
    }
}