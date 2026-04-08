class PublisherView {
    constructor() {
        this.tableBody = document.getElementById('publisher-table-body');
    }

    renderPublishers(publishers) {
        if (!this.tableBody) return;

        if (publishers.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Không có dữ liệu nhà xuất bản.</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = publishers.map(pub => {
            const avatarChar = pub.name ? pub.name.charAt(0).toUpperCase() : '?';
            const pubColor = pub.color || '#f59e0b'; // Màu cam đặc trưng cho NXB

            return `
                <tr>
                    <td class="ps-4 fw-bold text-dark">${pub.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${pubColor}20; color: ${pubColor};">
                                ${avatarChar}
                            </div>
                            <span class="fw-medium text-dark">${pub.name}</span>
                        </div>
                    </td>
                    <td class="text-muted">${pub.address || '-'}</td>
                    <td class="text-muted">${pub.email || '-'}</td>
                    <td class="text-end pe-4">
                        <div class="d-flex justify-content-end align-items-center gap-2">
                            <button class="btn btn-sm btn-light text-primary"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-light text-danger"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    // Bắt sự kiện nút Thêm mới (Mở modal)
    bindAddPublisher(handler) {
        const addBtn = document.querySelector('.btn-primary');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                // Giả sử ông dùng Bootstrap Modal có id là publisherModal
                const modalElement = document.getElementById('publisherModal');
                if (modalElement) {
                    const modal = new bootstrap.Modal(modalElement);
                    document.getElementById('publisherForm').reset();
                    document.getElementById('publisherId').value = '';
                    modal.show();
                }
            });
        }
    }

    // Bắt sự kiện Lưu (Submit form)
    bindSavePublisher(handler) {
        const form = document.getElementById('publisherForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = document.getElementById('publisherId').value;
                const data = {
                    name: document.getElementById('pubName').value.trim(),
                    email: document.getElementById('pubEmail').value.trim(),
                    address: document.getElementById('pubAddress').value.trim()
                };
                handler(id, data);
            });
        }
    }

    // Bắt sự kiện Xóa và Sửa (Dùng Event Delegation vì Table render động)
    bindTableActions(handleEdit, handleDelete) {
        this.tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.text-primary'); // Nút sửa
            const deleteBtn = e.target.closest('.text-danger'); // Nút xóa

            if (editBtn) {
                const id = editBtn.closest('tr').cells[0].textContent;
                handleEdit(id);
            }

            if (deleteBtn) {
                const id = deleteBtn.closest('tr').cells[0].textContent;
                if (confirm(` bạn có chắc muốn xóa NXB mã ${id} không?`)) {
                    handleDelete(id);
                }
            }
        });
    }

    // Bắt sự kiện Tìm kiếm
    bindSearch(handler) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                handler(e.target.value.trim());
            });
        }
    }

    // Đổ dữ liệu vào form khi bấm Sửa
    fillForm(pub) {
        document.getElementById('publisherId').value = pub.id;
        document.getElementById('pubName').value = pub.name;
        document.getElementById('pubEmail').value = pub.email;
        document.getElementById('pubAddress').value = pub.address;
        
        const modal = new bootstrap.Modal(document.getElementById('publisherModal'));
        modal.show();
    }
}