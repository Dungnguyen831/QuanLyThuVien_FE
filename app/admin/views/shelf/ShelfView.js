class ShelfView {
    constructor() {
        this.tableBody = document.getElementById('shelf-table-body');
        this.searchInput = document.getElementById('searchInput');
        this.shelfModal = new bootstrap.Modal(document.getElementById('shelfModal'));
        this.shelfForm = document.getElementById('shelfForm');
        // Thêm nút khai báo nút Add ở đây để dùng cho bindEvents
        this.btnAdd = document.getElementById('btn-add-shelf');
    }

    // --- HÀM SHOW MODAL THÊM Ở ĐÂY ---
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

    // Lắng nghe các hành động từ người dùng
    bindEvents(handlers) {
        // Sự kiện tìm kiếm
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                handlers.handleSearch(e.target.value);
            });
        }
        const floorFilter = document.getElementById('floorFilter');


        // --- THÊM SỰ KIỆN NÚT "THÊM KỆ SÁCH" Ở ĐÂY ---
        this.btnAdd?.addEventListener('click', () => {
            this.showModal();
        });

        // --- THÊM SỰ KIỆN SUBMIT FORM LƯU Ở ĐÂY ---
        this.shelfForm?.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('shelfId').value;
            const shelfData = {
                name: document.getElementById('shelfName').value,
                floor: document.getElementById('shelfFloor').value,
            };
            handlers.handleSave(id, shelfData);
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
                    const id = deleteBtn.dataset.id;
                    if (confirm(`Bạn có chắc muốn xóa kệ mã ${id} không?`)) {
                        handlers.handleDelete(id);
                    }
                }
            });
        }
        document.getElementById('floorFilter')?.addEventListener('change', (e) => {
    // Gọi hàm handleFilter mà mình vừa thêm ở Controller
    handlers.handleFilter(e.target.value);
    });
    }

    renderShelves(shelves) {
        if (!this.tableBody) return;

        if (shelves.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Không tìm thấy kệ sách nào.</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = shelves.map(shelf => {
            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'];
            const randomColor = colors[shelf.id % colors.length];

            return `
                <tr class="align-middle">
                    <td class="ps-4 fw-bold text-dark">${shelf.id}</td>
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