class CategoryView {
    constructor() {
        this.tableBody = document.getElementById('category-table-body');
    }

    renderCategories(categories) {
        if (!this.tableBody) return;

        // Nếu mảng rỗng
        if (categories.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Không có dữ liệu danh mục.</td></tr>`;
            return;
        }

        // Vẽ từng dòng dữ liệu
        this.tableBody.innerHTML = categories.map(category => {
            // Lấy chữ cái đầu tiên của tên làm Avatar (VD: "Lập trình" -> "L")
            const avatarChar = category.name ? category.name.charAt(0).toUpperCase() : '?';
            
            // Màu sắc cho danh mục (Có thể lấy từ DB hoặc mặc định màu Primary)
            const categoryColor = category.color || '#2b6df6'; 

            // Trả về chuỗi HTML của dòng (Dùng Template String ` `)
            return `
                <tr>
                    <td class="ps-4 fw-bold text-dark">${category.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${categoryColor}20; color: ${categoryColor};">
                                ${avatarChar}
                            </div>
                            <span class="badge rounded-pill bg-primary-subtle text-primary px-3 fw-bold">
                                ${category.name}
                            </span>
                        </div>
                    </td>
                    <td class="text-muted">
                        ${category.description || 'Chưa có mô tả cho danh mục này'}
                    </td>
                    <td class="text-muted">${category.createdAt || '-'}</td>
                    <td class="text-end pe-4">
                        <div class="d-flex justify-content-end align-items-center gap-2">
                            <button class="btn btn-sm btn-light text-primary" title="Chỉnh sửa">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-light text-danger" title="Xóa">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn btn-link text-muted p-0 ms-1">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }
}