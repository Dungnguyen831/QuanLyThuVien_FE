class PublisherView {
    constructor() {
        this.tableBody = document.getElementById('publisher-table-body');
        // 1. Khởi tạo Modal xóa từ HTML
        const deleteModalElem = document.getElementById('deleteConfirmModal');
        if (deleteModalElem) {
            this.deleteModal = new bootstrap.Modal(deleteModalElem);
        }
        
        // Biến tạm để giữ ID cần xóa
        this.currentDeleteId = null;
    }

    renderPublishers(publishers) {
        if (!this.tableBody) return;

        const countElement = document.getElementById('total-publishers-count');
        if (countElement) {
            countElement.innerText = `Hiển thị ${publishers.length} nhà xuất bản`;
        }

        if (publishers.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Không có dữ liệu nhà xuất bản.</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = publishers.map(pub => {
            const avatarChar = pub.name ? pub.name.charAt(0).toUpperCase() : '?';
            const pubColor = pub.color || '#f59e0b';

            return `
                <tr>
                    <td class="ps-4 fw-bold text-dark">NXB${pub.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${pubColor}20; color: ${pubColor}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                ${avatarChar}
                            </div>
                            <span class="fw-medium text-dark">${pub.name}</span>
                        </div>
                    </td>
                    <td class="text-muted">${pub.address || '-'}</td>
                    <td class="text-muted">${pub.email || '-'}</td>
                    <td class="text-end pe-4">
                        <div class="d-flex justify-content-end align-items-center gap-2">
                            <button class="btn btn-sm btn-light text-primary edit-btn"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-sm btn-light text-danger delete-btn"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    bindAddPublisher(handler) {
        const addBtn = document.querySelector('.btn-primary');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
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
                // Gọi hàm kiểm tra
            if (this.validateForm(data)) {
                handler(id, data);
            }
            });
        }
    }

    bindTableActions(handleEdit, handleDelete) {
        // Sự kiện cho bảng (Sửa & Xóa)
        this.tableBody.addEventListener('click', (e) => {
            const editBtn = e.target.closest('.text-primary');
            const deleteBtn = e.target.closest('.text-danger');

            if (editBtn) {
                const id = editBtn.closest('tr').cells[0].textContent.replace('NXB', '');
                handleEdit(id);
            }

            if (deleteBtn) {
                const id = deleteBtn.closest('tr').cells[0].textContent.replace('NXB', '');
                this.currentDeleteId = id;
                if (this.deleteModal) this.deleteModal.show();
            }
        });

        // Bắt sự kiện click vào nút "Xác nhận xóa" trong Modal (Chỉ gán 1 lần)
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                if (this.currentDeleteId) {
                    handleDelete(this.currentDeleteId);
                    this.deleteModal.hide();
                }
            };
        }
    }

    bindSearch(handler) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                handler(e.target.value.trim());
            });
        }
    }

    fillForm(pub) {
        document.getElementById('publisherId').value = pub.id;
        document.getElementById('pubName').value = pub.name;
        document.getElementById('pubEmail').value = pub.email;
        document.getElementById('pubAddress').value = pub.address;
        
        const modal = new bootstrap.Modal(document.getElementById('publisherModal'));
        modal.show();
    }
    validateForm(data) {
    // Validate Tên NXB (1-100 ký tự)
    if (!data.name || data.name.length < 1 || data.name.length > 100) {
        alert("Tên NXB phải từ 1 đến 100 ký tự.");
        return false;
    }

    // Validate Email (Regex chuẩn + Độ dài)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email) || data.email.length > 255) {
        alert("Email không hợp lệ hoặc quá dài.");
        return false;
    }

    // Validate Địa chỉ (1-255 ký tự)
    if (!data.address || data.address.length < 1 || data.address.length > 255) {
        alert("Địa chỉ phải từ 1 đến 255 ký tự.");
        return false;
    }

    return true;
}
}