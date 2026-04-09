class CategoryView {
    constructor() {
        this.tableBody = document.getElementById('category-table-body');
        this.form = document.getElementById('categoryForm');
        this.modal = new bootstrap.Modal(document.getElementById('categoryModal'));
        this.deleteModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal')); 
        this.searchInput = document.getElementById('searchInput');
        this.addBtn = document.getElementById('addCategoryBtn');
        this.currentDeleteId = null; // Biến tạm giữ ID cần xóa
    }

    renderCategories(categories) {
        if (!this.tableBody) return;

        if (categories.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Không có dữ liệu danh mục.</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = categories.map(category => {
            const avatarChar = category.name ? category.name.charAt(0).toUpperCase() : '?';
            const categoryColor = category.color || '#2b6df6'; 

            return `
                <tr>
                    <td class="ps-4 fw-bold text-dark">DM${String(category.id).padStart(3, '0')}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${categoryColor}20; color: ${categoryColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                ${avatarChar}
                            </div>
                            <span class="badge rounded-pill bg-primary-subtle text-primary px-3 fw-bold">
                                ${category.name}
                            </span>
                        </div>
                    </td>
                    <td class="text-muted" style="max-width: 300px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${category.description || 'Chưa có mô tả'}
                    </td>
                    <td class="text-center fw-bold text-dark">
                        ${category.bookCount || 0}
                    </td>
                    <td class="text-end pe-4">
                        <div class="d-flex justify-content-end align-items-center gap-2">
                            <button class="btn btn-sm btn-light text-primary edit-btn" data-id="${category.id}" title="Chỉnh sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-light text-danger delete-btn" data-id="${category.id}" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');

        const countElement = document.getElementById('total-categories-count') || document.getElementById('category-count');
        if (countElement) {
            countElement.innerText = `Hiển thị ${categories.length} danh mục`;
        }
    }

    // Lắng nghe sự kiện Submit Form (Thêm/Sửa)
    bindSaveCategory(handler) {
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('categoryId')?.value;
                const data = {
                    name: document.getElementById('catName').value,
                    description: document.getElementById('catDescription').value,
                    bookcount: 0, // Mặc định số lượng sách mới là 0
                };
                handler(id, data);
            });
        }
    }

    // Lắng nghe ô tìm kiếm
    bindSearch(handler) {
        if (this.searchInput) {
            this.searchInput.addEventListener('input', e => handler(e.target.value));
        }
    }

    // Lắng nghe nút Sửa
    bindEditCategory(handler) {
        if (this.tableBody) {
            this.tableBody.addEventListener('click', e => {
                const btn = e.target.closest('.edit-btn');
                if (btn) {
                    const id = btn.dataset.id;
                    handler(id);
                }
            });
        }
    }

    // Lắng nghe nút Xóa và xác nhận Modal
    bindDeleteCategory(handler) {
        if (this.tableBody) {
            this.tableBody.addEventListener('click', e => {
                const btn = e.target.closest('.delete-btn');
                if (btn) {
                    this.currentDeleteId = btn.dataset.id;
                    this.deleteModal.show();
                }
            });
        }

        const confirmBtn = document.getElementById('confirmDeleteBtn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                handler(this.currentDeleteId);
                this.deleteModal.hide();
            };
        }
    }

    // Mở modal để sửa
    showEditModal(category) {
        document.getElementById('modalTitle').innerText = "Chỉnh sửa danh mục";
        if (document.getElementById('categoryId')) document.getElementById('categoryId').value = category.id;
        document.getElementById('catName').value = category.name;
        document.getElementById('catDescription').value = category.description || '';
        this.modal.show();
    }

    // Mở modal để thêm mới
    showAddModal() {
        if (this.form) this.form.reset();
        document.getElementById('modalTitle').innerText = "Thêm danh mục mới";
        if (document.getElementById('categoryId')) document.getElementById('categoryId').value = '';
        this.modal.show();
    }
}