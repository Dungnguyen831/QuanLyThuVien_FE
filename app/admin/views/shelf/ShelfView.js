class ShelfView {
    constructor() {
        this.tableBody = document.getElementById('shelf-table-body');
    }

   renderShelves(shelves) {
    if (!this.tableBody) return;

    if (shelves.length === 0) {
        this.tableBody.innerHTML = `<tr><td colspan="6" class="text-center py-4">Không có dữ liệu kệ sách.</td></tr>`;
        return;
    }

    this.tableBody.innerHTML = shelves.map(shelf => {
        // Tạo màu ngẫu nhiên nhẹ nhàng cho avatar
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
                        <span class="fw-bold text-primary" style="cursor: pointer;">${shelf.name}</span>
                    </div>
                </td>
                <td>
                    <span class="badge rounded-pill bg-light text-dark border px-3">Tầng ${shelf.floor || 1}</span>
                </td>
                <td>
                    <div class="text-muted">—</div> </td>
                <td>
                    <span class="badge bg-success-subtle text-success border-0">● Hoạt động</span>
                </td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-outline-primary border-0 edit-btn" data-id="${shelf.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger border-0 delete-btn" data-id="${shelf.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        }).join('');
        document.getElementById('total-shelves-count').innerText = `Hiển thị ${shelves.length} kệ sách`;
    }
}
