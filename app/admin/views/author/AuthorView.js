class AuthorView {
    constructor() {
        this.tableBody = document.getElementById('author-table-body');
    }

    renderAuthors(authors) {
        if (!this.tableBody) return;

        // Nếu mảng rỗng
        if (authors.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Không có dữ liệu tác giả.</td></tr>`;
            return;
        }

        // Vẽ từng dòng dữ liệu
        this.tableBody.innerHTML = authors.map(author => {
            // Lấy chữ cái đầu tiên của tên làm Avatar (VD: "Nguyễn Văn A" -> "N")
            const avatarChar = author.name ? author.name.charAt(0).toUpperCase() : '?';
            
            // Random hoặc chỉ định màu sắc cho Avatar (Sử dụng lại logic màu từ Loan)
            const avatarColor = author.avatarColor || '#6c757d'; 

            // Trả về chuỗi HTML của dòng (Dùng Template String ` `)
            return `
                <tr>
                    <td class="ps-4 fw-bold text-dark">${author.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${avatarColor}20; color: ${avatarColor};">
                                ${avatarChar}
                            </div>
                            <span class="fw-medium text-dark">${author.name}</span>
                        </div>
                    </td>
                    <td class="text-muted" style="max-width: 300px; white-space: nowrap; overflow: hidden; text-transform: none; text-overflow: ellipsis;">
                        ${author.biography || 'Chưa có tiểu sử'}
                    </td>
                    <td class="text-muted">${author.createdAt || '-'}</td>
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