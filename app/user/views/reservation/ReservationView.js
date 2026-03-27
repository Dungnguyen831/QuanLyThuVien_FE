/**
 * Reservation View Class
 * Handles all rendering logic for the Reservations page including:
 * - Stats cards updates
 * - Reservation table rendering with conditional status badges
 * - Event binding
 */
class ReservationView {
    constructor() {
        // Stats elements
        this.activeBorrowsElement = document.getElementById('active-borrows');
        this.upcomingDueElement = document.getElementById('upcoming-due');
        this.activeReservationsElement = document.getElementById('active-reservations');

        // Table elements
        this.tableBody = document.getElementById('reservation-table-body');

        // Button elements
        this.newReservationBtn = document.getElementById('new-reservation-btn');

        // Event listeners storage
        this.eventListeners = {};
    }

    /**
     * Update the stats cards with dashboard data
     * @param {Object} statsData - Statistics data object with activeBorrows, upcomingDue, activeReservations
     */
    updateStatsCards(statsData) {
        if (!statsData) return;

        if (statsData.activeBorrows !== undefined) {
            this.activeBorrowsElement.textContent = statsData.activeBorrows;
        }

        if (statsData.upcomingDue !== undefined) {
            this.upcomingDueElement.textContent = statsData.upcomingDue;
        }

        if (statsData.activeReservations !== undefined) {
            this.activeReservationsElement.textContent = statsData.activeReservations;
        }
    }

    /**
     * Render reservation table with data rows
     * @param {Array} reservations - Array of reservation objects
     */
    renderReservationTable(reservations) {
        if (!reservations || reservations.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="5" class="empty-message">No reservations found.</td></tr>';
            return;
        }

        this.tableBody.innerHTML = reservations.map(reservation =>
            this._createReservationRow(reservation)
        ).join('');

        // Bind action buttons
        this._bindTableActions();
    }

    /**
     * Create a single table row for a reservation
     * @private
     * @param {Object} reservation - Combined reservation+book object from BE
     * @returns {string} HTML table row string
     */
    _createReservationRow(reservation) {
        const statusBadge = this._createStatusBadge(reservation.status);
        const formattedDate = this._formatDate(reservation.reservationDate);

        // Handle image URL (BE returns imageUrl instead of cover)
        const imageUrl = this._escapeHtml(reservation.imageUrl || reservation.cover || '/assets/images/no-book-cover.jpg');
        const title = this._escapeHtml(reservation.title || 'Unknown Title');

        // Get author name or fallback to authorId
        const author = this._escapeHtml(reservation.author || `Author ID: ${reservation.authorId || 'N/A'}`);

        return `
            <tr class="reservation-row" data-reservation-id="${reservation.id}">
                <td class="col-cover">
                    <img src="${imageUrl}" alt="${title}" class="book-cover-thumb">
                </td>
                <td class="col-title">
                    <div class="book-info">
                        <p class="book-title">${title}</p>
                        <p class="book-author">${author}</p>
                    </div>
                </td>
                <td class="col-date">
                    <span class="date">${formattedDate}</span>
                </td>
                <td class="col-status">
                    ${statusBadge}
                </td>
                <td class="col-actions">
                    <div class="action-buttons">
                        <button class="action-btn action-btn-details" data-action="details" title="View Details">
                            DETAILS
                        </button>
                        <button class="action-btn action-btn-cancel" data-action="cancel" title="Cancel Reservation">
                            CANCEL
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Create status badge HTML based on reservation status
     * @private
     * @param {string} status - Status value ('ready', 'pending', 'in-queue')
     * @returns {string} HTML badge string
     */
    _createStatusBadge(status) {
        let badgeClass = 'status-badge';
        let badgeText = status;

        switch (status.toLowerCase()) {
            case 'ready':
                badgeClass += ' status-ready';
                badgeText = 'Ready for Pickup';
                break;
            case 'pending':
                badgeClass += ' status-pending';
                badgeText = 'Pending';
                break;
            case 'in-queue':
                badgeClass += ' status-in-queue';
                badgeText = 'In Queue (4)';
                break;
            default:
                badgeClass += ' status-default';
        }

        return `<span class="${badgeClass}">${badgeText}</span>`;
    }

    /**
     * Format date string to readable format
     * @private
     * @param {string} dateString - Date string in format 'YYYY-MM-DD'
     * @returns {string} Formatted date
     */
    _formatDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    }

    /**
     * Escape HTML special characters to prevent XSS
     * @private
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    _escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, char => map[char]);
    }

    /**
     * Bind table action buttons
     * @private
     */
    _bindTableActions() {
        const detailsButtons = this.tableBody.querySelectorAll('[data-action="details"]');
        const cancelButtons = this.tableBody.querySelectorAll('[data-action="cancel"]');

        detailsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reservationId = e.target.closest('.reservation-row').dataset.reservationId;
                if (this.eventListeners.onDetailsClick) {
                    this.eventListeners.onDetailsClick(reservationId);
                }
            });
        });

        cancelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reservationId = e.target.closest('.reservation-row').dataset.reservationId;
                if (this.eventListeners.onCancelClick) {
                    this.eventListeners.onCancelClick(reservationId);
                }
            });
        });
    }

    /**
     * Bind new reservation button click event
     * @param {Function} callback - Callback function when button is clicked
     */
    onNewReservationClick(callback) {
        this.eventListeners.onNewReservationClick = callback;
        this.newReservationBtn.addEventListener('click', callback);
    }

    /**
     * Bind details button click event
     * @param {Function} callback - Callback function with reservation ID
     */
    onDetailsClick(callback) {
        this.eventListeners.onDetailsClick = callback;
    }

    /**
     * Bind cancel button click event
     * @param {Function} callback - Callback function with reservation ID
     */
    onCancelClick(callback) {
        this.eventListeners.onCancelClick = callback;
    }

    /**
     * Show loading state
     */
    showLoading() {
        this.tableBody.innerHTML = '<tr><td colspan="5" class="loading-message">Loading reservations...</td></tr>';
    }

    /**
     * Show error state
     * @param {string} message - Error message to display
     */
    showError(message) {
        this.tableBody.innerHTML = `<tr><td colspan="5" class="error-message">${this._escapeHtml(message)}</td></tr>`;
    }

    /**
     * Remove a row from the table
     * @param {string|number} reservationId - ID of reservation to remove
     */
    removeTableRow(reservationId) {
        const row = this.tableBody.querySelector(`[data-reservation-id="${reservationId}"]`);
        if (row) {
            row.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => row.remove(), 300);
        }
    }
}