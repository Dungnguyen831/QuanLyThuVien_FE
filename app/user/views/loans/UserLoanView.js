class UserLoanView {
    constructor() {
        this.tbody = document.getElementById('loan-table-body');
        this.loading = document.getElementById('page-loading');
    }

    showLoading() {
        if (this.loading) this.loading.style.display = 'flex';
    }

    hideLoading() {
        if (this.loading) this.loading.style.display = 'none';
    }

    showError(message) {
        if (this.tbody) {
            this.tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#dc3545;">${message}</td></tr>`;
        }
    }

    // Hàm nhận dữ liệu mảng phẳng từ API và in ra bảng
    renderLoans(loans) {
        if (!loans || loans.length === 0) {
            this.tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Bạn chưa có lịch sử mượn sách nào.</td></tr>`;
            return;
        }

        let html = '';

        loans.forEach(loan => {
            // 1. Phân tích trạng thái để chọn Badge
            let badgeHtml = '';
            const statusStr = (loan.status || "").toLowerCase();
            
            if (statusStr === "borrowing") {
                badgeHtml = `<span class="badge bg-primary" style="padding: 6px 10px; border-radius: 6px;">Đang mượn</span>`;
            } else if (statusStr === "returned") {
                badgeHtml = `<span class="badge bg-success" style="padding: 6px 10px; border-radius: 6px;">Đã trả</span>`;
            } else if (statusStr === "overdue") {
                badgeHtml = `<span class="badge bg-danger" style="padding: 6px 10px; border-radius: 6px;">Quá hạn</span>`;
            } else {
                badgeHtml = `<span class="badge bg-secondary">${loan.status}</span>`;
            }

            // 2. Xác định ngày hiển thị: Đã trả thì hiện Ngày Trả, Chưa trả thì hiện Hẹn Trả
            const displayDate = (loan.returnDate && loan.returnDate !== "-") ? loan.returnDate : loan.dueDate;
            
            // 3. Xử lý ID (API đang trả về dạng String như "MP001", nếu là số thì dùng padStart)
            const displayId = loan.id.toString().startsWith("MP") ? loan.id : `#MP${loan.id.toString().padStart(3, '0')}`;

            // 4. Gắn dữ liệu vào các attribute (data-*) để Modal đọc được
            html += `
                <tr>
                    <td class="loan-id fw-bold text-primary">${displayId}</td>
                    <td style="font-weight: 500;">${loan.bookName}</td>
                    <td>${displayDate}</td>
                    <td>${badgeHtml}</td>
                    <td style="text-align: right;">
                        <button class="btn-view-detail btn btn-sm btn-outline-info" 
                            data-barcode="${loan.barcode || 'Chưa cập nhật'}" 
                            data-borrow="${loan.borrowDate || 'Chưa cập nhật'}" 
                            data-note="${loan.note || 'Không có ghi chú.'}">
                            👁️ Chi tiết
                        </button>
                    </td>
                </tr>
            `;
        });

        this.tbody.innerHTML = html;
    }

    // Hàm gắn sự kiện click cho bảng (chuẩn MVC, không dùng window.function)
    bindViewDetails() {
        if (!this.tbody) return;
        
        this.tbody.addEventListener("click", (e) => {
            const btn = e.target.closest(".btn-view-detail");
            if (!btn) return;

            // 1. Lấy dữ liệu ẩn từ thẻ button
            const barcode = btn.getAttribute("data-barcode");
            const borrowDate = btn.getAttribute("data-borrow");
            const note = btn.getAttribute("data-note");

            // 2. Đổ dữ liệu vào Modal (ID này lấy từ file HTML ở bước trước)
            const barcodeEl = document.getElementById("modal-barcode");
            const borrowDateEl = document.getElementById("modal-borrow-date");
            const noteEl = document.getElementById("modal-note");

            if(barcodeEl) barcodeEl.innerText = barcode;
            if(borrowDateEl) borrowDateEl.innerText = borrowDate;
            if(noteEl) noteEl.innerText = note;

            // 3. Gọi Bootstrap Modal hiện lên
            const modalElement = document.getElementById("loanDetailModal");
            if (modalElement) {
                bootstrap.Modal.getOrCreateInstance(modalElement).show();
            }
        });
    }
}