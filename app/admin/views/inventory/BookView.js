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
            
            const imgUrl = book.imageUrl ? book.imageUrl : 'https://via.placeholder.com/150x200.png?text=No+Image';
            const tr = document.createElement('tr');
            
            let statusHtml = book.availableQty > 0 
                ? `<span class="d-inline-block rounded-circle bg-success me-1" style="width:8px;height:8px"></span><span class="text-success fw-medium">Sẵn sàng</span>`
                : `<span class="d-inline-block rounded-circle bg-danger me-1" style="width:8px;height:8px"></span><span class="text-danger fw-medium">Hết sách</span>`;
    
            tr.innerHTML = `
                <td class="ps-4 fw-bold text-dark">${book.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${imgUrl}" class="rounded me-2" style="width: 40px; height: 55px; object-fit: cover;">
                        <div class="fw-bold">${book.title || 'Chưa có tên'}</div>
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
}