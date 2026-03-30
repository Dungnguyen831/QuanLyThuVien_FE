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

        const readyCount = reservations.filter(r => r.status && r.status.toLowerCase() === 'ready').length;
        const pendingCount = reservations.filter(r => r.status && r.status.toLowerCase() === 'pending').length;
        const totalCount = reservations.length;

        return {
            activeBorrows: readyCount,
            upcomingDue: pendingCount,
            activeReservations: totalCount
        };
    }

    /**
     * Handle new reservation button click
     */
    handleNewReservation() {
        console.log('New reservation clicked');
        // TODO: Implement navigation to search/book selection page
        // or open a modal for creating a new reservation
        alert('Feature coming soon: Create a new reservation');
    }

    /**
     * Handle view details button click
     * @param {string|number} reservationId - ID of the reservation
     */
    handleViewDetails(reservationId) {
        console.log('Viewing details for reservation:', reservationId);
        // TODO: Implement navigation to reservation details page
        // or open a modal with detailed information
        alert(`Viewing details for reservation ${reservationId}`);
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