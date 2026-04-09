class AuthorView {
    constructor() {
        this.tableBody = document.getElementById('author-table-body');
        this.form = document.getElementById('authorForm');
        this.modal = new bootstrap.Modal(document.getElementById('authorModal'));
        this.searchInput = document.getElementById('searchInput');
        this.deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal')); 
        this.searchInput = document.getElementById('searchInput');
        this.currentDeleteId = null; // Biến tạm để giữ ID cần xóa
    }
    

    renderAuthors(authors) {
    if (!this.tableBody) return;

    if (authors.length === 0) {
        this.tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">Không có dữ liệu tác giả.</td></tr>`;
        return;
    }

    this.tableBody.innerHTML = authors.map(author => {
        const avatarChar = author.name ? author.name.charAt(0).toUpperCase() : '?';
        const avatarColor = author.avatarColor || '#6c757d'; 

        // --- ĐOẠN SỬA LOGIC HIỂN THỊ STATUS ---
        const rawStatus = (author.status || '').toLowerCase();
        const isActive = rawStatus === 'active' || rawStatus === 'đang hợp tác';
        
        const statusText = isActive ? 'Đang hợp tác' : 'Ngừng hợp tác';
        const statusClass = isActive ? 'text-success' : 'text-danger';
        const indicatorClass = isActive ? 'bg-success' : 'bg-danger';
        // --------------------------------------

        return `
            <tr>
                <td class="ps-4 fw-bold text-dark">TG${String(author.id).padStart(3, '0')}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="avatar-circle me-2" style="background-color: ${avatarColor}20; color: ${avatarColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                            ${avatarChar}
                        </div>
                        <span class="fw-medium text-dark">${author.name}</span>
                    </div>
                </td>
                <td class="text-muted" style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${author.biography || 'Chưa có tiểu sử'}
                </td>
                <td>${author.country || 'Việt Nam'}</td> 
                <td class="fw-bold text-center">${author.bookcount ?? 0}</td> 
                <td>
                    <span class="status-indicator ${indicatorClass}" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 5px;"></span>
                    <span class="${statusClass} fw-medium">${statusText}</span>
                </td>
                <td class="text-end pe-4">
                    <div class="d-flex justify-content-end align-items-center gap-2">
                        <button class="btn btn-sm btn-light text-primary edit-btn" data-id="${author.id}" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-light text-danger delete-btn" data-id="${author.id}" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    const countElement = document.getElementById('total-authors-count');
    if (countElement) {
        countElement.innerText = `Hiển thị ${authors.length} tác giả`;
    }
}
    // Lắng nghe sự kiện Submit Form (Thêm/Sửa)
    bindSaveAuthor(handler) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('authorId').value;
            const data = {
                name: document.getElementById('authorName').value,
                biography: document.getElementById('authorBio').value,
                country: document.getElementById('authorCountry')?.value || 'Việt Nam',
                bookcount: parseInt(document.getElementById('authorBookCount')?.value) || 0,
                status: document.getElementById('authorStatus')?.value || 'Đang hợp tác'
            };
            handler(id, data);
        });
    }
    bindSearch(handler) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', e => handler(e.target.value));
    }
    }
    // Lắng nghe nút Sửa
    bindEditAuthor(handler) {
        this.tableBody.addEventListener('click', e => {
            const btn = e.target.closest('.edit-btn');
            if (btn) {
                const id = btn.dataset.id;
                handler(id);
            }
        });
    }

    // Lắng nghe nút Xóa
    bindDeleteAuthor(handler) {
    this.tableBody.addEventListener('click', e => {
        const btn = e.target.closest('.btn-light.text-danger') || e.target.closest('.delete-btn');
        if (btn) {
            // 1. Lấy ID từ dòng (row)
            const row = btn.closest('tr');
            const idText = row.querySelector('td:first-child').innerText;
            this.currentDeleteId = parseInt(idText.replace('TG', ''));

            // 2. Hiện cái hộp thoại Modal đẹp lên thay vì confirm()
            this.deleteModal.show();
        }
    });

    // 3. Lắng nghe nút "Xác nhận xóa" bên trong Modal
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            handler(this.currentDeleteId);
            this.deleteModal.hide(); // Xóa xong thì ẩn đi
        });
        }
    }

    // Mở modal để sửa
    showEditModal(author) {
        document.getElementById('modalTitle').innerText = "Chỉnh sửa tác giả";
        document.getElementById('authorId').value = author.id;
        document.getElementById('authorName').value = author.name;
        document.getElementById('authorBio').value = author.biography;
        document.getElementById('authorCountry').value = author.country || 'Việt Nam';
        document.getElementById('authorBookCount').value = author.bookcount || 0;
        document.getElementById('authorStatus').value = author.status || 'Đang hợp tác';
        this.modal.show();
    }

    // Mở modal để thêm mới
    showAddModal() {
    this.form.reset(); // Nó sẽ đưa toàn bộ input về trạng thái mặc định (trống)
    document.getElementById('modalTitle').innerText = "Thêm tác giả mới";
    document.getElementById('authorId').value = '';
    
    // Đảm bảo không có dòng nào gán .value cho authorBookCount ở đây nữa
    this.modal.show();
    }
    // Thêm vào trong class AuthorView
    bindFilters(handler) {
    const countryFilter = document.getElementById('filterCountry');
    const statusFilter = document.getElementById('filterStatus');

    const callback = () => {
        handler({
            country: countryFilter.value,
            status: statusFilter.value
        });
    };

    if (countryFilter) countryFilter.addEventListener('change', callback);
    if (statusFilter) statusFilter.addEventListener('change', callback);
    }
}