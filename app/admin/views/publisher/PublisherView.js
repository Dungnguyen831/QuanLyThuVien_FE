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
                    <td class="text-muted">${pub.address || 'N/A'}</td>
                    <td class="text-muted">${pub.email || 'N/A'}</td>
                    <td class="text-muted">${pub.createdAt || '-'}</td>
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