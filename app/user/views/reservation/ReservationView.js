/**
 * ReservationView.js
 * Hiển thị danh sách đặt chỗ, không dùng async/await trong render
 * Code HTML cứng bằng Template Literals
 * Uses ImageService for proper image URL handling
 */
class ReservationView {
    constructor() {
        this.tableBody = document.getElementById('reservation-table-body');
    }


    renderStats(stats) {
        if (this.activeBorrowsEl) this.activeBorrowsEl.textContent = stats.activeBorrows;
        if (this.upcomingDueEl) this.upcomingDueEl.textContent = stats.upcomingDue;
        if (this.activeReservationsEl) this.activeReservationsEl.textContent = stats.activeReservations;
    }


    renderReservations(reservations) {
        if (!this.tableBody) return;

        if (!reservations || reservations.length === 0) {
            this.tableBody.innerHTML = '<tr><td colspan="5">Không có đặt chỗ nào</td></tr>';
            return;
        }

        // Build HTML rows
        const rows = reservations.map(res => {
            const imageUrl = this._getImageUrl(res.cover);
            return this._createRow(res, imageUrl);
        }).join('');

        this.tableBody.innerHTML = rows;
    }

    /**
     * Get proper image URL using ImageService
     * @private
     */
    _getImageUrl(cover) {
        if (!cover) return '/assets/img/default-book.jpg';

        if (typeof ImageService !== 'undefined') {
            return ImageService.getImageUrl(cover);
        }

        // Fallback: if cover doesn't have /assets path, add it
        if (!cover.startsWith('/') && !cover.startsWith('http')) {
            return `/assets/img/${cover}`;
        }
        return cover;
    }

    /**
     * Create a single reservation row
     * @private
     */
    _createRow(res, imageUrl) {
        const title = res.title || 'Không xác định';
        const author = res.author || res.authorName || 'Tác giả không xác định';

        let currentStatus = (res.status || '').toUpperCase();
        let pickupDateText = '-';


        if (currentStatus === 'APPROVED' || currentStatus === 'COMPLETED') {
            const dateString = res.reservationDate || res.updatedAt;
            if (dateString) {
                const dateObj = new Date(dateString);
                pickupDateText = dateObj.toLocaleDateString('vi-VN');
            }
        }

        // Render các trạng thái hiển thị
        const statusBadgeClass = currentStatus.toLowerCase();
        const statusText = this._getStatusText(currentStatus);
        const isApproved = currentStatus === 'APPROVED';

        // - Chỉ cho phép người dùng tự bấm Hủy khi đơn đang Chờ duyệt hoặc Đã duyệt
        const cancelBtn = (currentStatus === 'PENDING' || currentStatus === 'APPROVED')
            ? '<button class="btn-action btn-danger" data-action="cancel">Hủy</button>'
            : '';

        return `<tr class="reservation-row" data-reservation-id="${res.id}">
            <td>
                <img 
                    src="${imageUrl}" 
                    alt="" 
                    class="book-cover-thumb"
                    onerror="this.src='/assets/img/default-book.jpg'"
                >
            </td>
            <td>
                <div>
                    <p class="book-title">${title}</p>
                    <p class="book-author">${author}</p>
                </div>
            </td>
            <td style="font-weight: 500;">${pickupDateText}</td> 
            <td>
                <span class="badge badge-${statusBadgeClass}">
                    ${statusText}
                </span>
            </td>
            <td>
                <button class="btn-action" data-action="details">Chi tiết</button>
                ${cancelBtn}
            </td>
        </tr>`;
    }

    /**
     * Event Delegation: Gắn listener vào cha, dùng e.target.closest()
     */
    attachEventListeners(controllerCallback) {
        if (!this.tableBody) return;

        this.tableBody.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-action');
            if (!btn) return;

            const action = btn.dataset.action;
            const row = e.target.closest('.reservation-row');
            const reservationId = row.dataset.reservationId;

            const controller = controllerCallback();
            controller.handleAction(action, reservationId);
        });
    }

    /**
     * Attach event listener to "New Reservation" button
     */
    attachNewReservationButton(controllerCallback) {
        const newReservationBtn = document.getElementById('new-reservation-btn');
        if (!newReservationBtn) return;

        newReservationBtn.addEventListener('click', async () => {
            const controller = controllerCallback();
            await controller.openNewReservationForm();
        });
    }

    /**
     * Convert status to Vietnamese text
     */
    _getStatusText(status) {
        if (!status) return 'Không xác định';
        const statusUpper = String(status).toUpperCase().trim();
        const map = {
            'PENDING': 'Chờ duyệt',
            'APPROVED': 'Đã duyệt',
            'COMPLETED': 'Hoàn thành',
            'CANCELLED': 'Đã hủy'
        };
        return map[statusUpper] || status;
    }

    /**
     * Show loading state
     */
    showLoading() {
        if (this.tableBody) {
            this.tableBody.innerHTML = '<tr><td colspan="5">Đang tải...</td></tr>';
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (this.tableBody) {
            this.tableBody.innerHTML = `<tr><td colspan="5" class="text-error">${message}</td></tr>`;
        }
    }
}