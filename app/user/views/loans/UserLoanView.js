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
        this.tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#dc3545;">${message}</td></tr>`;
    }

    // Hàm nhận dữ liệu mảng và in ra bảng
    renderLoans(loans) {
        if (!loans || loans.length === 0) {
            this.tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Bạn chưa có lịch sử mượn sách nào.</td></tr>`;
            return;
        }

        let html = '';
        const today = new Date();

        loans.forEach(loan => {
            // Phân tích trạng thái
            let hasOverdue = false;
            let hasBorrowing = false;
            let totalBooks = 0;
            let barcodeList = [];

            if (loan.loanDetails) {
                totalBooks = loan.loanDetails.length;
                loan.loanDetails.forEach(detail => {
                    // Collect barcodes from loan details - try multiple field names
                    const barcode = detail.barcode ||
                        detail.bookCopyBarcode ||
                        detail.book_copy_barcode ||
                        detail.copyBarcode ||
                        (detail.bookCopy && detail.bookCopy.barcode);

                    if (barcode) {
                        barcodeList.push(barcode);
                    }

                    // Also try from copy object
                    if (detail.copy && detail.copy.barcode) {
                        barcodeList.push(detail.copy.barcode);
                    }

                    if (detail.status === 'borrowing') {
                        hasBorrowing = true;
                        const dueDate = new Date(detail.dueDate || detail.due_date);
                        if (dueDate < today) hasOverdue = true;
                    }
                });
            }

            // Debug logging
            console.log('UserLoanView - Processing loan:', {
                loanId: loan.id,
                totalBooks,
                barcodes: barcodeList,
                loanDetails: loan.loanDetails
            });

            // Tạo Badge
            let badgeHtml = '';
            if (hasOverdue) {
                badgeHtml = `<span class="badge badge-overdue">Có sách quá hạn</span>`;
            } else if (hasBorrowing) {
                badgeHtml = `<span class="badge badge-borrowing">Đang mượn</span>`;
            } else {
                badgeHtml = `<span class="badge badge-returned">Đã trả hết</span>`;
            }

            const borrowDate = new Date(loan.borrowDate || loan.borrow_date).toLocaleDateString('vi-VN');
            const formatId = `${loan.id.toString().padStart(3, '0')}`;
            const note = loan.note || "Phiếu mượn tại quầy";

            // Display barcode info - show barcodes for current loan
            let barcodeDisplay = '';
            if (barcodeList.length > 0) {
                barcodeDisplay = `<div style="font-size: 0.8rem; color: #4f46e5; margin-top: 0.25rem;">🔖 Barcode: ${barcodeList.join(', ')}</div>`;
            }

            html += `
                <tr>
                    <td class="loan-id">#${formatId}</td>
                    <td>
                        <div style="font-weight: 500;">${note}</div>
                        <div style="font-size: 0.85rem; color: #6b7280;">${totalBooks} cuốn sách</div>
                        ${barcodeDisplay}
                    </td>
                    <td>${borrowDate}</td>
                    <td>${badgeHtml}</td>
                    <td style="text-align: right;">
                        <button class="btn-view" onclick="window.viewLoanDetails(${loan.id})">👁️ Chi tiết</button>
                    </td>
                </tr>
            `;
        });

        this.tbody.innerHTML = html;
    }
}

window.viewLoanDetails = function (loanId) {
    console.log("Xem chi tiết phiếu mượn ID:", loanId);
    alert(`Tính năng xem chi tiết các cuốn sách trong phiếu #${loanId} sẽ hiển thị ở Popup!`);
}