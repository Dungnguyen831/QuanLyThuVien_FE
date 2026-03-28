class BookView {
    constructor() {
        this.tableBody = document.getElementById('inventory-table-body');
    }

    setupUIState() {
        const headerDisplay = document.getElementById('page-title');
        if (headerDisplay) headerDisplay.textContent = 'Quản lý kho sách';
        document.querySelectorAll('#sidebar-wrapper .list-group-item').forEach(el => el.classList.remove('active'));
        const submenuEl = document.getElementById('inventorySubmenu');
        if (submenuEl && typeof bootstrap !== 'undefined') {
            bootstrap.Collapse.getOrCreateInstance(submenuEl, { toggle: false }).show();
            const parent = document.getElementById('inventoryParent');
            if (parent) parent.classList.add('active-parent');
            const link = document.getElementById('link-inventory');
            if (link) link.classList.add('active');
        }
    }

    /**
     * FIX: Đọc author_id từ @JsonGetter của Entity Book.java
     */
    renderBooks(books, authors, categories, publishers) { // Thêm publishers vào tham số
        this.tableBody.innerHTML = ''; 
        if (!books || books.length === 0) return;
    
        books.forEach(book => {
            const aId = book.author_id || book.authorId; 
            const cId = book.category_id || book.categoryId;
            const pId = book.publisher_id || book.publisherId; // Lấy thêm ID Nhà xuất bản
    
            const author = authors.find(a => a.id == aId);
            const category = categories.find(c => c.id == cId);
            const publisher = publishers ? publishers.find(p => p.id == pId) : null; // Tìm NXB
            
            const imgUrl = ImageService.getImageUrl(book.imageUrl);
            const tr = document.createElement('tr');
            tr.setAttribute('data-id', book.id);
            
            let statusHtml = book.availableQty > 0 
                ? `<span class="d-inline-block rounded-circle bg-success me-1" style="width:8px;height:8px"></span><span class="text-success fw-medium">Sẵn sàng</span>`
                : `<span class="d-inline-block rounded-circle bg-danger me-1" style="width:8px;height:8px"></span><span class="text-danger fw-medium">Hết sách</span>`;
    
            tr.innerHTML = `
                <td class="ps-4 fw-bold text-dark">${book.id}</td>
              
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${imgUrl}" 
                            class="rounded me-2 border" 
                            style="width: 50px; height: 70px; object-fit: cover;" 
                            onerror="this.src='/assets/img/default-book.jpg'"> 
                        
                        <div class="fw-bold text-truncate" style="max-width: 250px;">
                            ${book.title || 'Chưa có tên'}
                        </div>
                    </div>
                </td>
                <td>${author ? author.name : 'N/A'}</td>
                <td><span class="badge rounded-pill bg-primary-subtle text-primary">${category ? category.name : 'N/A'}</span></td>
                <td>${publisher ? publisher.name : 'Kệ A1'}</td> <td class="fw-bold">${book.availableQty || 0}</td>
                <td>${statusHtml}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light text-primary me-1 btn-edit-book" data-id="${book.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-light text-danger btn-delete-book" data-id="${book.id}"><i class="fas fa-trash"></i></button>
                </td>
            `;
            this.tableBody.appendChild(tr);
        });
    }
    // xử lý hiển thị chi tiết sách trong modal
    // Trong BookView.js
   // Cập nhật hàm renderBookDetailToModal trong BookView.js
    renderBookDetailToModal(book, authors, categories, publishers) {
        if (!book) return;

        // 1. Tìm kiếm tên từ danh sách (Giống logic hàm renderBooks của ông)
        const author = authors.find(a => a.id == (book.author_id || book.authorId));
        const category = categories.find(c => c.id == (book.category_id || book.categoryId));
        const publisher = publishers.find(p => p.id == (book.publisher_id || book.publisherId));

        // 2. Đổ dữ liệu vào các ID trong HTML
        
        ImageService.display('detailBookImage', book.imageUrl);        
        document.getElementById('detailBookTitle').textContent = book.title || 'N/A';
        document.getElementById('detailBookId').textContent = `#${book.id}`;

        // Đổ tên thay vì N/A
        document.getElementById('detailAuthor').textContent = author ? author.name : 'N/A';
        document.getElementById('detailCategory').textContent = category ? category.name : 'N/A';
        document.getElementById('modalBookPublisher').textContent = publisher ? publisher.name : 'N/A';

        // Các trường khác
        document.getElementById('detailTotal').textContent = book.totalQty || 0;
        document.getElementById('detailAvailable').textContent = book.availableQty || 0;
        document.getElementById('modalBookIsbn').textContent = book.isbn || 'N/A';
        document.getElementById('modalBookYear').textContent = book.publishedYear || 'N/A';
        document.getElementById('modalBookDescription').textContent = book.description || 'Chưa có mô tả.';
    }

    renderCopiesToModal(copies) {
        const tbody = document.getElementById('copy-table-body');
        if (!tbody) return;
        tbody.innerHTML = copies.length ? copies.map(c => `
            <tr>
                <td>#${c.id}</td>
                <td>${c.shelf_id || 'Chưa xếp kệ'}</td> 
                <td><code>${c.barcode || '---'}</code></td>
                <td>${c.conditionStatus || 'NEW'}</td>
                <td>
                    <span class="badge ${c.availabilityStatus === 'AVAILABLE' ? 'bg-success' : 'bg-warning'}">
                        ${c.availabilityStatus || 'N/A'}
                    </span>
                </td>
                <td class="text-end"><button class="btn btn-sm btn-light text-danger"><i class="fas fa-trash"></i></button></td>
            </tr>
        `).join('') : '<tr><td colspan="6" class="text-center">Chưa có bản sao nào</td></tr>';
    }
    // Thiết lập sự kiện tìm kiếm bản sao trong modal
    setupCopySearch(allCopies) {
        const searchInput = document.getElementById('copySearchInput');
        if (!searchInput) return;

        searchInput.oninput = (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            // Lọc danh sách dựa trên ID hoặc Barcode
            const filtered = allCopies.filter(copy => {
                const idMatch = copy.id.toString().includes(query);
                const barcodeMatch = (copy.barcode || '').toLowerCase().includes(query);
                return idMatch || barcodeMatch;
            });

            // Gọi lại hàm render bảng với danh sách đã lọc
            this.renderCopiesToModal(filtered);
        };
    }
   // Vẽ thanh phân trang
    renderPagination(totalItems, currentPage, itemsPerPage, onPageChange) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const container = document.querySelector('.pagination');
        if (!container) return;

        let html = `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></a>
            </li>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`;
        }

        html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></a>
            </li>`;

        container.innerHTML = html;

        // Gán sự kiện click cho các nút phân trang
        container.querySelectorAll('.page-link').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const page = parseInt(link.dataset.page);
                if (page >= 1 && page <= totalPages) onPageChange(page);
            };
        });

        this.updatePaginationText(totalItems, currentPage, itemsPerPage);
    }

    updatePaginationText(totalItems, currentPage, itemsPerPage) {
        const textEl = document.querySelector('.card .text-muted small');
        if (!textEl) return;
        const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(currentPage * itemsPerPage, totalItems);
        textEl.innerHTML = `Hiển thị <b class="text-dark">${start}</b> đến <b class="text-dark">${end}</b> trong tổng số <b class="text-dark">${totalItems}</b> kết quả`;
    }
}