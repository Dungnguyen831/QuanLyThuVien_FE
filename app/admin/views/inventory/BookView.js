class BookView {
    constructor() {
        this.tableBody = document.getElementById('inventory-table-body');
    }

    // Cập nhật trạng thái active cho Sidebar và Header
    setupUIState() {
        const headerDisplay = document.getElementById('page-title');
        if (headerDisplay) headerDisplay.textContent = 'Quản lý kho sách';

        document.querySelectorAll('#sidebar-wrapper .list-group-item').forEach(el => el.classList.remove('active'));

        const submenuEl = document.getElementById('inventorySubmenu');
        const parentNode = document.getElementById('inventoryParent');
        const detailLink = document.getElementById('link-inventory');

        if (submenuEl && typeof bootstrap !== 'undefined') {
            const bsCollapse = new bootstrap.Collapse(submenuEl, { toggle: false });
            bsCollapse.show();
            
            if (parentNode) {
                parentNode.classList.add('active-parent');
                parentNode.setAttribute('aria-expanded', 'true');
            }
            if (detailLink) detailLink.classList.add('active');
        }
    }

    showLoading() {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-muted">
                    <i class="fas fa-spinner fa-spin me-2"></i> Đang tải dữ liệu sách...
                </td>
            </tr>
        `;
    }

    showError(message) {
        this.tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4 text-danger">
                    <i class="fas fa-exclamation-triangle me-2"></i> ${message}
                </td>
            </tr>
        `;
    }

    renderBooks(books) {
        this.tableBody.innerHTML = '';

        if (!books || books.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-4 text-muted">Chưa có cuốn sách nào trong kho.</td>
                </tr>
            `;
            return;
        }

        books.forEach(book => {
            // SỬA LẠI TÊN BIẾN Ở ĐÂY CHO KHỚP VỚI BACKEND
            let statusHtml = book.availableQty > 0 // Đổi từ availableCopies
                ? `<span class="d-inline-block rounded-circle bg-success me-1" style="width: 8px; height: 8px;"></span><span class="text-success fw-medium">Sẵn sàng</span>`
                : `<span class="d-inline-block rounded-circle bg-danger me-1" style="width: 8px; height: 8px;"></span><span class="text-danger fw-medium">Hết sách</span>`;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="ps-4 fw-bold text-dark">${book.id}</td>
                <td><div class="fw-bold">${book.title}</div></td>
                
                <td>${book.author_id}</td> 
                <td><span class="badge rounded-pill bg-primary-subtle text-primary">${book.category_id}</span></td>
                
                <td>Kệ A1</td> <td class="fw-bold">${book.availableQty}</td> <td>${statusHtml}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light text-primary me-1" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-light text-danger" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            `;
            this.tableBody.appendChild(tr);
        });
    }
}