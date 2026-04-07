class ReaderView {
  constructor() {
    this.tableBody = document.getElementById("reader-table-body");
  }

  setupUIState() {
    const headerDisplay = document.getElementById("page-title");
    if (headerDisplay) headerDisplay.textContent = "Quản lý Độc giả";

    document
      .querySelectorAll("#sidebar-wrapper .list-group-item")
      .forEach((el) => el.classList.remove("active"));

    const submenuEl = document.getElementById("readerSubmenu");
    if (submenuEl && typeof bootstrap !== "undefined") {
      bootstrap.Collapse.getOrCreateInstance(submenuEl, {
        toggle: false,
      }).show();
      const parent = document.getElementById("readerParent");
      if (parent) parent.classList.add("active-parent");
    }

    const link = document.querySelector(
      '#sidebar-wrapper a[href="../reader/reader.html"]',
    );
    if (link) link.classList.add("active");
  }

  renderReaders(readers) {
    this.tableBody.innerHTML = "";
    if (!readers || readers.length === 0) {
      this.tableBody.innerHTML =
        '<tr><td colspan="7" class="text-center py-4 text-muted">Không tìm thấy độc giả nào</td></tr>';
      return;
    }

    readers.forEach((reader) => {
      const tr = document.createElement("tr");
      tr.setAttribute("data-id", reader.id);

      const isActive =
        reader.status && reader.status.toUpperCase() === "ACTIVE";
      const statusHtml = isActive
        ? `<span class="d-inline-block rounded-circle bg-success me-1" style="width:8px;height:8px"></span><span class="text-success fw-medium">Đang hoạt động</span>`
        : `<span class="d-inline-block rounded-circle bg-danger me-1" style="width:8px;height:8px"></span><span class="text-danger fw-medium">Đã khóa</span>`;

      const lockActionHtml = isActive
        ? `<button class="btn btn-sm btn-light text-warning me-1 btn-toggle-status" data-id="${reader.id}" data-status="INACTIVE" title="Khóa thẻ"><i class="fas fa-lock"></i></button>`
        : `<button class="btn btn-sm btn-light text-success me-1 btn-toggle-status" data-id="${reader.id}" data-status="ACTIVE" title="Mở khóa"><i class="fas fa-unlock"></i></button>`;

      const firstLetter = reader.fullName
        ? reader.fullName.charAt(0).toUpperCase()
        : "R";
      const avatarColor = isActive ? "bg-primary" : "bg-secondary";

      tr.innerHTML = `
                <td class="ps-4 fw-bold text-dark">#${reader.id}</td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="${avatarColor} text-white rounded-circle d-flex justify-content-center align-items-center me-3" style="width: 35px; height: 35px; font-weight: bold;">
                            ${firstLetter}
                        </div>
                        <div class="fw-bold text-dark">${reader.fullName || "Chưa cập nhật"}</div>
                    </div>
                </td>
                <td>
                    <div class="small"><i class="fas fa-envelope text-muted me-1"></i> ${reader.email || "---"}</div>
                </td>
                <td>
                    <div class="small mt-1"><i class="fas fa-phone text-muted me-1"></i> ${reader.phone || "---"}</div>
                </td>
                <td><span class="badge rounded-pill bg-info-subtle text-info">Độc giả</span></td>
                <td>${statusHtml}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-sm btn-light text-primary me-1 btn-edit-reader" data-id="${reader.id}" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                    ${lockActionHtml}
                    <button class="btn btn-sm btn-light text-danger btn-delete-reader" data-id="${reader.id}" title="Xóa"><i class="fas fa-trash"></i></button>
                </td>
            `;
      this.tableBody.appendChild(tr);
    });
  }

  renderPagination(totalItems, currentPage, itemsPerPage, onPageChange) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const container = document.querySelector(".pagination");
    if (!container) return;

    let html = `
            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></a>
            </li>`;

    for (let i = 1; i <= totalPages; i++) {
      html += `
                <li class="page-item ${i === currentPage ? "active" : ""}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>`;
    }

    html += `
            <li class="page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}">
                <a class="page-link" href="#" data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></a>
            </li>`;

    container.innerHTML = html;

    container.querySelectorAll(".page-link").forEach((link) => {
      link.onclick = (e) => {
        e.preventDefault();
        const page = parseInt(link.dataset.page);
        if (page >= 1 && page <= totalPages) onPageChange(page);
      };
    });

    this.updatePaginationText(totalItems, currentPage, itemsPerPage);
  }

  updatePaginationText(totalItems, currentPage, itemsPerPage) {
    const textEl = document.querySelector(".card .text-muted small");
    if (!textEl) return;
    const start = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    textEl.innerHTML = `Hiển thị <b class="text-dark">${start}</b> đến <b class="text-dark">${end}</b> trong tổng số <b class="text-dark">${totalItems}</b> kết quả`;
  }

  // Thêm vào bên trong class ReaderView
  bindEditReader(handler) {
    this.tableBody.addEventListener("click", (e) => {
      // Tìm xem người dùng có bấm trúng nút Sửa (hoặc icon bên trong nó) không
      const btn = e.target.closest(".btn-edit-reader");
      if (btn) {
        const id = btn.dataset.id;
        handler(id); // "Gửi tín hiệu" về cho Controller kèm theo ID
      }
    });
  }
}
