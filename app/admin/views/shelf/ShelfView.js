class ShelfView {
    constructor() {
        this.tableBody = document.getElementById('shelf-table-body');
    }

    renderShelves(shelves) {
        if (!this.tableBody) return;

        if (shelves.length === 0) {
            this.tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4">Không có dữ liệu kệ sách.</td></tr>`;
            return;
        }

        this.tableBody.innerHTML = shelves.map(shelf => {
            const avatarChar = shelf.name ? shelf.name.charAt(0).toUpperCase() : 'S';
            const shelfColor = '#10b981'; // Màu xanh lá cho Kệ sách (Shelf)

            return `
                <tr>
                    <td class="ps-4 fw-bold text-dark">${shelf.id}</td>
                    <td>
                        <div class="d-flex align-items-center">
                            <div class="avatar-circle me-2" style="background-color: ${shelfColor}20; color: ${shelfColor};">
                                ${avatarChar}
                            </div>
                            <span class="fw-bold text-dark">${shelf.name}</span>
                        </div>
                    </td>
                    <td>
                        <span class="badge bg-light text-dark border">Tầng ${shelf.floor || 1}</span>
                    </td>
                    <td class="text-muted">${shelf.createdAt || '-'}</td>
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
}