class ReservationView {
    constructor() {
        this.tableBody = document.getElementById("reservation-table-body");
    }

    renderReservations(reservations) {
        if (!this.tableBody) return;
        this.tableBody.innerHTML = reservations.map(res => {
            let statusHtml = '';
            let actionHtml = '';

            // LOGIC HIỂN THỊ NÚT THEO TRẠNG THÁI
            switch(res.status.toLowerCase()) {
                case 'pending':
                    statusHtml = `<span class="badge bg-warning text-dark bg-opacity-25 border border-warning px-2 py-1 rounded-pill">Chờ xử lý</span>`;
                    actionHtml = `
                        <button class="btn btn-sm btn-outline-success btn-approve" data-id="${res.id}"><i class="fas fa-check me-1"></i>Duyệt</button>
                        <button class="btn btn-sm btn-outline-danger btn-cancel" data-id="${res.id}"><i class="fas fa-times me-1"></i>Hủy</button>`;
                    break;
                case 'approved':
                    statusHtml = `<span class="badge bg-primary bg-opacity-10 text-primary border border-primary px-2 py-1 rounded-pill">Chờ nhận sách</span>`;
                    actionHtml = `
                        <button class="btn btn-sm btn-primary btn-deliver" data-id="${res.id}"><i class="fas fa-handshake me-1"></i>Giao sách</button>
                        <button class="btn btn-sm btn-outline-danger btn-cancel" data-id="${res.id}"><i class="fas fa-ban me-1"></i>Hủy</button>`;
                    break;
                case 'completed':
                    statusHtml = `<span class="badge bg-success bg-opacity-10 text-success border border-success px-2 py-1 rounded-pill">Đã hoàn thành</span>`;
                    actionHtml = `<button class="btn btn-sm btn-light border btn-detail" data-id="${res.id}"><i class="fas fa-eye me-1"></i>Chi tiết</button>`;
                    break;
                case 'cancelled':
                    statusHtml = `<span class="badge bg-secondary bg-opacity-10 text-secondary border border-secondary px-2 py-1 rounded-pill">Đã hủy</span>`;
                    actionHtml = `<button class="btn btn-sm btn-light disabled"><i class="fas fa-info-circle"></i></button>`;
                    break;
            }

            return `
                <tr>
                    <td class="ps-4">RES${String(res.id).padStart(3, '0')}</td>
                    <td><b>${res.userName}</b><br><small>${res.userEmail}</small></td>
                    <td>${res.bookName}</td>
                    <td>${res.reservationDate}</td>
                    <td>${statusHtml}</td>
                    <td class="text-center">${actionHtml}</td>
                </tr>`;
        }).join("");
    }

    // Hiển thị Popup chi tiết (Sử dụng Bootstrap Modal)
    showDetailModal(res) {
        const modalHtml = `
            <div class="modal fade" id="resDetailModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content border-0 shadow rounded-4">
                        <div class="modal-header border-0">
                            <h5 class="modal-title fw-bold">Chi tiết phiếu đặt #RES${String(res.id).padStart(3, '0')}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <p><b>Độc giả:</b> ${res.userName}</p>
                            <p><b>Email:</b> ${res.userEmail}</p>
                            <p><b>Sách đặt:</b> ${res.bookName}</p>
                            <p><b>Ngày đặt:</b> ${res.reservationDate}</p>
                            <p><b>Trạng thái:</b> <span class="text-uppercase fw-bold text-success">${res.status}</span></p>
                        </div>
                    </div>
                </div>
            </div>`;
        
        // Xóa modal cũ nếu có và thêm modal mới
        const oldModal = document.getElementById('resDetailModal');
        if (oldModal) oldModal.remove();
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('resDetailModal'));
        modal.show();
    }
}