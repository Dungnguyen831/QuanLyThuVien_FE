class ShelfView {
    constructor() {
        this.tableBody = document.getElementById('shelf-table-body');
        this.searchInput = document.getElementById('searchInput');
        this.shelfModal = new bootstrap.Modal(document.getElementById('shelfModal'));
        
        // 1. Khởi tạo Modal xóa mới
        const deleteElem = document.getElementById('deleteConfirmModal');
        this.deleteConfirmModal = deleteElem ? new bootstrap.Modal(deleteElem) : null;
        
        this.shelfForm = document.getElementById('shelfForm');
        this.btnAdd = document.getElementById('btn-add-shelf');
        
        // Biến tạm lưu ID cần xóa
        this.currentDeleteId = null;
    }

    showModal(shelf = null) {
        if (shelf) {
            document.getElementById('modalTitle').innerText = "Cập nhật kệ sách";
            document.getElementById('shelfId').value = shelf.id;
            document.getElementById('shelfName').value = shelf.name;
            document.getElementById('shelfFloor').value = shelf.floor; 
        } else {
            document.getElementById('modalTitle').innerText = "Thêm kệ sách mới";
            this.shelfForm.reset();
            document.getElementById('shelfId').value = '';
        }
        this.shelfModal.show();
    }

    bindEvents(handlers) {
        // Tìm kiếm
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                handlers.handleSearch(e.target.value);
            });
        }

        // Thêm mới
        this.btnAdd?.addEventListener('click', () => {
            this.showModal();
        });

        // Submit form lưu
        this.shelfForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('shelfId').value;
            const shelfData = {
                name: document.getElementById('shelfName').value,
                floor: document.getElementById('shelfFloor').value,
            };
            handlers.handleSave(id, shelfData);
            this.shelfModal.hide(); // Đóng modal lưu sau khi xong
        });

        // Sự kiện trên bảng (Sửa/Xóa)
        if (this.tableBody) {
            this.tableBody.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.edit-btn');
                const deleteBtn = e.target.closest('.delete-btn');

                if (editBtn) {
                    handlers.handleEdit(editBtn.dataset.id);
                }
                
                if (deleteBtn) {
                    // 2. Thay vì confirm, ta gán ID và hiện Modal đẹp
                    this.currentDeleteId = deleteBtn.dataset.id;
                    if (this.deleteConfirmModal) {
                        this.deleteConfirmModal.show();
                    }
                }
            });
        }

        // 3. Xử lý nút "Xác nhận xóa" trong Modal
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.onclick = () => {
                if (this.currentDeleteId) {
                    handlers.handleDelete(this.currentDeleteId);
                    this.deleteConfirmModal.hide();
                }
            };
        }

        // Filter tầng
        document.getElementById('floorFilter')?.addEventListener('change', (e) => {
            handlers.handleFilter(e.target.value);
        });
    }

    renderShelves(shelves) {
        if (!this.tableBody) return;

        if (shelves.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">Không tìm thấy kệ sách nào.</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = shelves.map(shelf => {
            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
            const randomColor = colors[shelf.id % colors.length];

            return `
                <tr class="align-middle">
                    <td class="ps-4 fw-bold text-dark">K-${shelf.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-3" style="background-color: ${randomColor}20; color: ${randomColor}; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold;">
                                ${shelf.name ? shelf.name.charAt(0).toUpperCase() : 'S'}
                            </div>
                            <span class="fw-bold text-primary">${shelf.name}</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge rounded-pill bg-light text-dark border px-3">Tầng ${shelf.floor || 1}</span>
                    </td>
                    <td class="text-end pe-4">
                        <button class="btn btn-sm btn-outline-primary border-0 edit-btn" data-id="${shelf.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger border-0 delete-btn" data-id="${shelf.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
        
        const countEl = document.getElementById('total-shelves-count');
        if (countEl) countEl.innerText = `Hiển thị ${shelves.length} kệ sách`;
    }
}